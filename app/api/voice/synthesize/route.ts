import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { synthesizeSpeech, hexToBuffer, MiniMaxError, SynthesisOptions } from '@/lib/services/minimax'
import { v4 as uuidv4 } from 'uuid'

// Validate MP3 buffer
function validateMP3Buffer(buffer: Buffer): boolean {
  if (buffer.length < 4) return false
  
  // Check for ID3v2 header (ID3)
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
    return true
  }
  
  // Check for MP3 sync word (FF FB, FF FA, or FF F3)
  if (buffer[0] === 0xFF && (buffer[1] & 0xF0) === 0xF0) {
    return true
  }
  
  // Check if it might be ID3v1 (starts with TAG at the end)
  // But also check for MP3 data somewhere in the first 1KB
  const searchLength = Math.min(1024, buffer.length)
  for (let i = 0; i < searchLength - 1; i++) {
    if (buffer[i] === 0xFF && (buffer[i + 1] & 0xF0) === 0xF0) {
      return true
    }
  }
  
  return false
}

// POST /api/voice/synthesize - Generate speech from text using cloned voice
const synthesizeSchema = z.object({
  voice_profile_id: z.string().uuid(),
  text: z.string().min(1).max(5000), // Reasonable limit for UI
  emotion: z.enum(['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral']).optional(),
  speed: z.number().min(0.5).max(2.0).optional(),
  volume: z.number().min(0.1).max(10.0).optional(),
  pitch: z.number().min(-12).max(12).optional(),
  save_as_memory: z.boolean().default(false),
  memory_title: z.string().optional(),
  memory_description: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Validate request body
    const body = await request.json()
    const validatedData = synthesizeSchema.parse(body)
    
    // Get voice profile
    const { data: voiceProfile, error: profileError } = await supabase
      .from('voice_profiles')
      .select('*')
      .eq('id', validatedData.voice_profile_id)
      .eq('user_id', user.id)
      .single()
    
    if (profileError || !voiceProfile) {
      return NextResponse.json(
        { error: 'Voice profile not found' },
        { status: 404 }
      )
    }
    
    // Check if voice profile is trained
    if (voiceProfile.training_status !== 'completed') {
      return NextResponse.json(
        { error: 'Voice profile is not ready for synthesis' },
        { status: 400 }
      )
    }
    
    // Create synthesis job record
    const { data: synthesisJob, error: jobError } = await supabase
      .from('voice_synthesis_jobs')
      .insert({
        user_id: user.id,
        voice_profile_id: validatedData.voice_profile_id,
        text: validatedData.text,
        emotion: validatedData.emotion || 'neutral',
        status: 'processing'
      })
      .select()
      .single()
    
    if (jobError || !synthesisJob) {
      console.error('Error creating synthesis job:', jobError)
      return NextResponse.json(
        { error: 'Failed to create synthesis job' },
        { status: 500 }
      )
    }
    
    try {
      // Prepare synthesis options
      const synthesisOptions: SynthesisOptions = {
        text: validatedData.text,
        voiceId: voiceProfile.minimax_voice_id,
        model: voiceProfile.model_type as 'speech-02-hd' | 'speech-02-turbo',
        speed: validatedData.speed,
        volume: validatedData.volume,
        pitch: validatedData.pitch,
        emotion: validatedData.emotion as 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised' | 'neutral' | undefined,
        outputFormat: 'mp3'
      }
      
      // Call MiniMax synthesis API
      console.log('[Synthesis] Calling MiniMax with options:', {
        voiceId: synthesisOptions.voiceId,
        model: synthesisOptions.model,
        textLength: synthesisOptions.text.length,
        emotion: synthesisOptions.emotion
      })
      
      const synthesisResult = await synthesizeSpeech(synthesisOptions)
      
      // Log audio data details
      console.log('[Synthesis] MiniMax response:', {
        hasAudio: !!synthesisResult.data?.audio,
        audioLength: synthesisResult.data?.audio?.length || 0,
        first100Chars: synthesisResult.data?.audio?.substring(0, 100),
        traceId: synthesisResult.trace_id,
        extraInfo: synthesisResult.extra_info
      })
      
      // Convert hex-encoded audio data to Buffer
      const audioBuffer = hexToBuffer(synthesisResult.data.audio)
      
      // Validate MP3 header
      const isValidMP3 = validateMP3Buffer(audioBuffer)
      console.log('[Synthesis] Audio validation:', {
        bufferSize: audioBuffer.length,
        isValidMP3,
        firstBytes: audioBuffer.slice(0, 10).toString('hex')
      })
      
      if (!isValidMP3) {
        console.error('[Synthesis] Invalid MP3 data detected')
        throw new Error('Generated audio does not appear to be valid MP3 format')
      }
      
      // Generate unique filename
      const filename = `synthesis_${synthesisJob.id}_${Date.now()}.mp3`
      const storagePath = `${user.id}/synthesis/${filename}`
      
      // Upload to Supabase storage
      console.log('[Synthesis] Uploading audio to storage:', {
        path: storagePath,
        size: audioBuffer.length,
        contentType: 'audio/mpeg'
      })
      
      const { error: uploadError } = await supabase
        .storage
        .from('voice-memories')
        .upload(storagePath, audioBuffer, {
          contentType: 'audio/mpeg',
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) {
        console.error('[Synthesis] Upload error:', uploadError)
        throw new Error(`Failed to upload synthesized audio: ${uploadError.message}`)
      }
      
      // Create signed URL for private bucket (valid for 1 hour)
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('voice-memories')
        .createSignedUrl(storagePath, 3600) // 1 hour expiry
      
      if (signedUrlError || !signedUrlData?.signedUrl) {
        console.error('[Synthesis] Signed URL error:', signedUrlError)
        throw new Error('Failed to create access URL for synthesized audio')
      }
      
      const audioUrl = signedUrlData.signedUrl
      console.log('[Synthesis] Generated signed URL for audio access')
      
      // Update synthesis job
      await supabase
        .from('voice_synthesis_jobs')
        .update({
          status: 'completed',
          audio_url: storagePath,
          duration: Math.ceil(audioBuffer.length / (128000 / 8)), // Estimate duration from bitrate
          file_size: audioBuffer.length,
          minimax_request_id: synthesisResult.trace_id,
          completed_at: new Date().toISOString()
        })
        .eq('id', synthesisJob.id)
      
      // If user wants to save as memory
      if (validatedData.save_as_memory) {
        const { data: newMemory, error: memoryError } = await supabase
          .from('memories')
          .insert({
            user_id: user.id,
            title: validatedData.memory_title || `Synthesized: ${validatedData.text.substring(0, 50)}...`,
            description: validatedData.memory_description || `Created using ${voiceProfile.name} voice profile`,
            audio_url: storagePath,
            duration: Math.ceil(audioBuffer.length / (128000 / 8)), // Estimate duration from bitrate
            file_size: audioBuffer.length,
            file_type: 'audio/mpeg',
            is_cloned: true,
            source_voice_profile_id: validatedData.voice_profile_id,
            synthesis_job_id: synthesisJob.id,
            source_text: validatedData.text
          })
          .select()
          .single()
        
        if (!memoryError && newMemory) {
          return NextResponse.json({
            synthesis_job_id: synthesisJob.id,
            audio_url: audioUrl,
            duration: Math.ceil(audioBuffer.length / (128000 / 8)),
            memory_id: newMemory.id,
            saved_as_memory: true
          })
        }
      }
      
      return NextResponse.json({
        synthesis_job_id: synthesisJob.id,
        audio_url: audioUrl,
        duration: Math.ceil(audioBuffer.length / (128000 / 8)),
        saved_as_memory: false
      })
      
    } catch (error) {
      // Update synthesis job as failed
      await supabase
        .from('voice_synthesis_jobs')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Synthesis failed'
        })
        .eq('id', synthesisJob.id)
      
      throw error
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    if (error instanceof MiniMaxError) {
      console.error('MiniMax synthesis error:', {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        stack: error.stack
      })
      
      // Handle specific error codes
      if (error.code === '1002' || error.code === '1039') {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again in a moment.' },
          { status: 429 }
        )
      }
      
      if (error.code === 'CONFIG_ERROR') {
        return NextResponse.json(
          { 
            error: 'Voice synthesis service is not configured. Please contact support.',
            details: error.message
          },
          { status: 503 }
        )
      }
      
      if (error.code === 'AUTH_ERROR') {
        return NextResponse.json(
          { 
            error: 'Authentication failed with voice synthesis service.',
            details: error.message
          },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code,
          details: 'Check server logs for more information'
        },
        { status: error.statusCode || 500 }
      )
    }
    
    console.error('Unexpected synthesis error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error?.constructor?.name
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to synthesize speech. Please check server logs for details.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Configuration for longer timeout
export const maxDuration = 30 // 30 seconds timeout for synthesis