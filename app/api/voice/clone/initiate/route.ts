import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { uploadAudioFile, cloneVoice, MiniMaxError } from '@/lib/services/minimax'

// POST /api/voice/clone/initiate - Start voice cloning process
const initiateCloneSchema = z.object({
  voice_profile_id: z.string().uuid(),
  memory_id: z.string().uuid()
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
    const { voice_profile_id, memory_id } = initiateCloneSchema.parse(body)
    
    // Check voice profile exists and belongs to user
    const { data: voiceProfile, error: profileError } = await supabase
      .from('voice_profiles')
      .select('*')
      .eq('id', voice_profile_id)
      .eq('user_id', user.id)
      .single()
    
    if (profileError || !voiceProfile) {
      return NextResponse.json(
        { error: 'Voice profile not found' },
        { status: 404 }
      )
    }
    
    // Check if profile is already trained
    if (voiceProfile.training_status === 'completed') {
      return NextResponse.json(
        { error: 'Voice profile is already trained' },
        { status: 400 }
      )
    }
    
    // Check if training is already in progress
    if (voiceProfile.training_status === 'processing') {
      return NextResponse.json(
        { error: 'Voice training is already in progress' },
        { status: 400 }
      )
    }
    
    // Get memory with audio URL
    const { data: memory, error: memoryError } = await supabase
      .from('memories')
      .select('*')
      .eq('id', memory_id)
      .eq('user_id', user.id)
      .single()
    
    if (memoryError || !memory) {
      return NextResponse.json(
        { error: 'Memory not found' },
        { status: 404 }
      )
    }
    
    // Validate audio duration (10s - 5min)
    if (memory.duration < 10 || memory.duration > 300) {
      return NextResponse.json(
        { error: 'Audio duration must be between 10 seconds and 5 minutes' },
        { status: 400 }
      )
    }
    
    try {
      // Update profile status to processing
      await supabase
        .from('voice_profiles')
        .update({ 
          training_status: 'processing',
          training_started_at: new Date().toISOString()
        })
        .eq('id', voice_profile_id)
      
      // Download audio from Supabase storage
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('voice-memories')
        .download(memory.audio_url.replace('voice-memories/', ''))
      
      if (downloadError || !fileData) {
        throw new Error('Failed to download audio file')
      }
      
      // Convert blob to buffer
      const arrayBuffer = await fileData.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Upload to MiniMax
      const uploadResult = await uploadAudioFile(
        buffer,
        `memory_${memory_id}.${memory.file_type.split('/')[1]}`,
        memory.file_type
      )
      
      // Create training sample record
      await supabase
        .from('voice_training_samples')
        .insert({
          voice_profile_id,
          memory_id,
          minimax_file_id: uploadResult.file_id,
          upload_status: 'uploaded'
        })
      
      // Start voice cloning (synchronous operation)
      const cloneResult = await cloneVoice(
        uploadResult.file_id,
        voiceProfile.minimax_voice_id,
        voiceProfile.model_type as 'speech-02-hd' | 'speech-02-turbo'
      )
      
      // Voice cloning is synchronous - it either succeeds or fails immediately
      // The success check is done inside cloneVoice function
      // If we reach here, cloning was successful
      
      await supabase
        .from('voice_profiles')
        .update({
          training_status: 'completed',
          training_completed_at: new Date().toISOString()
        })
        .eq('id', voice_profile_id)
      
      return NextResponse.json({
        status: 'completed',
        voice_profile_id,
        minimax_voice_id: voiceProfile.minimax_voice_id,
        message: 'Voice cloning completed successfully!'
      })
      
    } catch (error) {
      // Update profile status to failed
      await supabase
        .from('voice_profiles')
        .update({
          training_status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', voice_profile_id)
      
      // Update training sample status if exists
      await supabase
        .from('voice_training_samples')
        .update({ upload_status: 'failed' })
        .eq('voice_profile_id', voice_profile_id)
        .eq('memory_id', memory_id)
      
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
      console.error('MiniMax API error:', error)
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code,
          details: 'Voice cloning service error'
        },
        { status: error.statusCode || 500 }
      )
    }
    
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate voice cloning' },
      { status: 500 }
    )
  }
}

// Configuration for longer timeout
export const maxDuration = 60 // 60 seconds timeout for voice cloning