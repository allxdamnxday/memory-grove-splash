import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { synthesizeSpeech, downloadAudioFile, MiniMaxError, SynthesisOptions } from '@/lib/services/minimax'
import { v4 as uuidv4 } from 'uuid'

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
        emotion: validatedData.emotion,
        model: voiceProfile.model_type as 'speech-02-hd' | 'speech-02-turbo',
        speed: validatedData.speed,
        volume: validatedData.volume,
        pitch: validatedData.pitch,
        outputFormat: 'mp3'
      }
      
      // Call MiniMax synthesis API
      const synthesisResult = await synthesizeSpeech(synthesisOptions)
      
      // Download the generated audio
      const audioBuffer = await downloadAudioFile(synthesisResult.audio_url)
      
      // Generate unique filename
      const filename = `synthesis_${synthesisJob.id}_${Date.now()}.mp3`
      const storagePath = `${user.id}/synthesis/${filename}`
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase
        .storage
        .from('voice-memories')
        .upload(storagePath, audioBuffer, {
          contentType: 'audio/mpeg',
          cacheControl: '3600'
        })
      
      if (uploadError) {
        throw new Error('Failed to upload synthesized audio')
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('voice-memories')
        .getPublicUrl(storagePath)
      
      // Update synthesis job
      await supabase
        .from('voice_synthesis_jobs')
        .update({
          status: 'completed',
          audio_url: storagePath,
          duration: synthesisResult.duration,
          file_size: audioBuffer.length,
          minimax_request_id: synthesisResult.request_id,
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
            duration: synthesisResult.duration,
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
            audio_url: publicUrl,
            duration: synthesisResult.duration,
            memory_id: newMemory.id,
            saved_as_memory: true
          })
        }
      }
      
      return NextResponse.json({
        synthesis_job_id: synthesisJob.id,
        audio_url: publicUrl,
        duration: synthesisResult.duration,
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
      console.error('MiniMax synthesis error:', error)
      
      // Handle specific error codes
      if (error.code === '1002' || error.code === '1039') {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again in a moment.' },
          { status: 429 }
        )
      }
      
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code
        },
        { status: error.statusCode || 500 }
      )
    }
    
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to synthesize speech' },
      { status: 500 }
    )
  }
}

// Configuration for longer timeout
export const maxDuration = 30 // 30 seconds timeout for synthesis