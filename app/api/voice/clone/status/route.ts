import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
// Note: Voice cloning is synchronous, so this endpoint just returns the current DB status

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
    
    // Return current database status
    // Since voice cloning is synchronous, the status in the DB is the final status
    const processingTime = voiceProfile.training_started_at && voiceProfile.training_completed_at
      ? Math.floor((new Date(voiceProfile.training_completed_at).getTime() - new Date(voiceProfile.training_started_at).getTime()) / 1000)
      : voiceProfile.training_started_at 
        ? Math.floor((Date.now() - new Date(voiceProfile.training_started_at).getTime()) / 1000)
        : 0
    
    return NextResponse.json({
      status: voiceProfile.training_status,
      voice_profile_id: voiceProfileId,
      minimax_voice_id: voiceProfile.minimax_voice_id,
      error_message: voiceProfile.error_message,
      completed_at: voiceProfile.training_completed_at,
      processing_time_seconds: processingTime,
      message: voiceProfile.training_status === 'processing' 
        ? 'Voice cloning should have completed. If stuck, please try again.'
        : undefined
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}