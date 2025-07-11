import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { checkVoiceCloneStatus, MiniMaxError } from '@/lib/services/minimax'

// GET /api/voice/clone/status?voice_profile_id=xxx - Check cloning status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const voiceProfileId = searchParams.get('voice_profile_id')
    
    if (!voiceProfileId) {
      return NextResponse.json(
        { error: 'voice_profile_id is required' },
        { status: 400 }
      )
    }
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(voiceProfileId)) {
      return NextResponse.json(
        { error: 'Invalid voice_profile_id format' },
        { status: 400 }
      )
    }
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get voice profile
    const { data: voiceProfile, error: profileError } = await supabase
      .from('voice_profiles')
      .select('*')
      .eq('id', voiceProfileId)
      .eq('user_id', user.id)
      .single()
    
    if (profileError || !voiceProfile) {
      return NextResponse.json(
        { error: 'Voice profile not found' },
        { status: 404 }
      )
    }
    
    // If already completed or failed, return current status
    if (voiceProfile.training_status === 'completed' || voiceProfile.training_status === 'failed') {
      return NextResponse.json({
        status: voiceProfile.training_status,
        voice_profile_id: voiceProfileId,
        minimax_voice_id: voiceProfile.minimax_voice_id,
        error_message: voiceProfile.error_message,
        completed_at: voiceProfile.training_completed_at
      })
    }
    
    // If pending, return pending status
    if (voiceProfile.training_status === 'pending') {
      return NextResponse.json({
        status: 'pending',
        voice_profile_id: voiceProfileId,
        message: 'Voice cloning has not been initiated yet'
      })
    }
    
    // Check status with MiniMax
    try {
      const cloneStatus = await checkVoiceCloneStatus(voiceProfile.minimax_voice_id)
      
      // Update database based on MiniMax status
      if (cloneStatus.status === 'completed') {
        await supabase
          .from('voice_profiles')
          .update({
            training_status: 'completed',
            training_completed_at: new Date().toISOString()
          })
          .eq('id', voiceProfileId)
        
        return NextResponse.json({
          status: 'completed',
          voice_profile_id: voiceProfileId,
          minimax_voice_id: voiceProfile.minimax_voice_id,
          processing_time: cloneStatus.processing_time
        })
      } else if (cloneStatus.status === 'failed') {
        await supabase
          .from('voice_profiles')
          .update({
            training_status: 'failed',
            error_message: cloneStatus.error_message || 'Voice cloning failed'
          })
          .eq('id', voiceProfileId)
        
        return NextResponse.json({
          status: 'failed',
          voice_profile_id: voiceProfileId,
          error_message: cloneStatus.error_message
        })
      }
      
      // Still processing
      const processingTime = voiceProfile.training_started_at 
        ? Math.floor((Date.now() - new Date(voiceProfile.training_started_at).getTime()) / 1000)
        : 0
      
      return NextResponse.json({
        status: 'processing',
        voice_profile_id: voiceProfileId,
        minimax_voice_id: voiceProfile.minimax_voice_id,
        processing_time_seconds: processingTime,
        message: 'Voice cloning in progress. This typically takes about 30 seconds.'
      })
      
    } catch (error) {
      if (error instanceof MiniMaxError) {
        // If we can't check status, but profile shows processing, assume it's still processing
        if (error.statusCode === 404) {
          // Voice ID not found might mean it's still being created
          return NextResponse.json({
            status: 'processing',
            voice_profile_id: voiceProfileId,
            message: 'Voice cloning in progress'
          })
        }
        
        console.error('MiniMax status check error:', error)
        return NextResponse.json(
          { 
            error: 'Failed to check cloning status',
            details: error.message
          },
          { status: 500 }
        )
      }
      
      throw error
    }
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}