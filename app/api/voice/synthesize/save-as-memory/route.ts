import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// POST /api/voice/synthesize/save-as-memory - Save an existing synthesis as a memory
const saveAsMemorySchema = z.object({
  synthesis_job_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional()
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
    const validatedData = saveAsMemorySchema.parse(body)
    
    // Get the synthesis job
    const { data: synthesisJob, error: jobError } = await supabase
      .from('voice_synthesis_jobs')
      .select(`
        *,
        voice_profiles!inner (
          id,
          name,
          user_id
        )
      `)
      .eq('id', validatedData.synthesis_job_id)
      .eq('status', 'completed')
      .single()
    
    if (jobError || !synthesisJob) {
      console.error('Synthesis job not found:', jobError)
      return NextResponse.json(
        { error: 'Synthesis job not found or not completed' },
        { status: 404 }
      )
    }
    
    // Verify the synthesis job belongs to the user
    if (synthesisJob.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - this synthesis does not belong to you' },
        { status: 403 }
      )
    }
    
    // Check if already saved as memory
    const { data: existingMemory } = await supabase
      .from('memories')
      .select('id')
      .eq('synthesis_job_id', validatedData.synthesis_job_id)
      .single()
    
    if (existingMemory) {
      return NextResponse.json(
        { error: 'This synthesis has already been saved as a memory' },
        { status: 400 }
      )
    }
    
    // Create the memory
    const { data: newMemory, error: memoryError } = await supabase
      .from('memories')
      .insert({
        user_id: user.id,
        title: validatedData.title,
        description: validatedData.description || `Created using ${synthesisJob.voice_profiles.name} voice profile`,
        audio_url: synthesisJob.audio_url,
        duration: synthesisJob.duration,
        file_size: synthesisJob.file_size,
        file_type: 'audio/mpeg',
        is_cloned: true,
        source_voice_profile_id: synthesisJob.voice_profile_id,
        synthesis_job_id: synthesisJob.id,
        source_text: synthesisJob.text
      })
      .select()
      .single()
    
    if (memoryError || !newMemory) {
      console.error('Error creating memory:', memoryError)
      return NextResponse.json(
        { error: 'Failed to save as memory' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      memory_id: newMemory.id,
      message: 'Voice memory saved successfully'
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to save as memory' },
      { status: 500 }
    )
  }
}