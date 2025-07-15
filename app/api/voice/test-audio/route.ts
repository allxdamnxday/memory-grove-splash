import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/voice/test-audio - Test audio file access
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the latest synthesis job
    const { data: latestJob, error: jobError } = await supabase
      .from('voice_synthesis_jobs')
      .select('*')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (jobError || !latestJob) {
      return NextResponse.json({
        error: 'No completed synthesis jobs found',
        details: jobError?.message
      }, { status: 404 })
    }
    
    // Try to download the audio file
    const { data: downloadData, error: downloadError } = await supabase
      .storage
      .from('voice-memories')
      .download(latestJob.audio_url)
    
    if (downloadError) {
      // Try creating a signed URL
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('voice-memories')
        .createSignedUrl(latestJob.audio_url, 60) // 1 minute for testing
      
      return NextResponse.json({
        job_id: latestJob.id,
        audio_path: latestJob.audio_url,
        file_size: latestJob.file_size,
        duration: latestJob.duration,
        download_error: downloadError.message,
        signed_url: signedUrlData?.signedUrl || null,
        signed_url_error: signedUrlError?.message || null,
        test_audio_tag: signedUrlData?.signedUrl 
          ? `<audio controls src="${signedUrlData.signedUrl}"></audio>` 
          : null
      })
    }
    
    // Analyze the downloaded audio
    const audioBuffer = Buffer.from(await downloadData.arrayBuffer())
    
    // Check MP3 header
    const hasID3 = audioBuffer[0] === 0x49 && audioBuffer[1] === 0x44 && audioBuffer[2] === 0x33
    const hasMP3Sync = audioBuffer[0] === 0xFF && (audioBuffer[1] & 0xF0) === 0xF0
    
    // Find MP3 sync in first 1KB
    let mp3SyncPosition = -1
    const searchLength = Math.min(1024, audioBuffer.length)
    for (let i = 0; i < searchLength - 1; i++) {
      if (audioBuffer[i] === 0xFF && (audioBuffer[i + 1] & 0xF0) === 0xF0) {
        mp3SyncPosition = i
        break
      }
    }
    
    return NextResponse.json({
      job_id: latestJob.id,
      audio_path: latestJob.audio_url,
      file_size: latestJob.file_size,
      actual_size: audioBuffer.length,
      duration: latestJob.duration,
      audio_analysis: {
        has_id3_header: hasID3,
        has_mp3_sync_at_start: hasMP3Sync,
        mp3_sync_position: mp3SyncPosition,
        first_10_bytes: audioBuffer.slice(0, 10).toString('hex'),
        last_10_bytes: audioBuffer.slice(-10).toString('hex')
      },
      synthesis_details: {
        text: latestJob.text,
        voice_profile_id: latestJob.voice_profile_id,
        emotion: latestJob.emotion,
        created_at: latestJob.created_at,
        minimax_request_id: latestJob.minimax_request_id
      }
    })
    
  } catch (error) {
    console.error('Test audio error:', error)
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}