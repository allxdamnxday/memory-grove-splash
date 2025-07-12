import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// GET /api/voice/synthesize/history - Get user's synthesis history
const historyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  voice_profile_id: z.string().uuid().optional(),
  search: z.string().optional()
})

export async function GET(request: NextRequest) {
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
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const queryParams = {
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      voice_profile_id: searchParams.get('voice_profile_id'),
      search: searchParams.get('search')
    }
    
    const { page, limit, voice_profile_id, search } = historyQuerySchema.parse(queryParams)
    
    // Calculate pagination
    const offset = (page - 1) * limit
    
    // Build query
    let query = supabase
      .from('voice_synthesis_jobs')
      .select(`
        id,
        text,
        emotion,
        audio_url,
        duration,
        file_size,
        status,
        created_at,
        completed_at,
        voice_profiles!inner (
          id,
          name,
          minimax_voice_id
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Add filters
    if (voice_profile_id) {
      query = query.eq('voice_profile_id', voice_profile_id)
    }
    
    if (search) {
      query = query.ilike('text', `%${search}%`)
    }
    
    // Execute query
    const { data: syntheses, error: queryError } = await query
    
    if (queryError) {
      console.error('Error fetching synthesis history:', queryError)
      return NextResponse.json(
        { error: 'Failed to fetch synthesis history' },
        { status: 500 }
      )
    }
    
    // Get total count for pagination
    let countQuery = supabase
      .from('voice_synthesis_jobs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
    
    if (voice_profile_id) {
      countQuery = countQuery.eq('voice_profile_id', voice_profile_id)
    }
    
    if (search) {
      countQuery = countQuery.ilike('text', `%${search}%`)
    }
    
    const { count, error: countError } = await countQuery
    
    if (countError) {
      console.error('Error counting synthesis history:', countError)
      return NextResponse.json(
        { error: 'Failed to count synthesis history' },
        { status: 500 }
      )
    }
    
    // Transform data for better UX
    const transformedSyntheses = syntheses?.map(synthesis => {
      const voiceProfile = Array.isArray(synthesis.voice_profiles) 
        ? synthesis.voice_profiles[0] 
        : synthesis.voice_profiles
      
      return {
        id: synthesis.id,
        text: synthesis.text,
        textPreview: synthesis.text.length > 100 
          ? synthesis.text.substring(0, 97) + '...'
          : synthesis.text,
        emotion: synthesis.emotion,
        audio_url: synthesis.audio_url,
        duration: synthesis.duration,
        file_size: synthesis.file_size,
        status: synthesis.status,
        created_at: synthesis.created_at,
        completed_at: synthesis.completed_at,
        voice_profile: {
          id: voiceProfile?.id || '',
          name: voiceProfile?.name || '',
          minimax_voice_id: voiceProfile?.minimax_voice_id || ''
        }
      }
    }) || []
    
    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return NextResponse.json({
      syntheses: transformedSyntheses,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        voice_profile_id,
        search
      }
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Unexpected error in synthesis history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch synthesis history' },
      { status: 500 }
    )
  }
}

// DELETE /api/voice/synthesize/history - Delete synthesis entry
export async function DELETE(request: NextRequest) {
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
    
    const { searchParams } = new URL(request.url)
    const synthesisId = searchParams.get('id')
    
    if (!synthesisId) {
      return NextResponse.json(
        { error: 'Synthesis ID is required' },
        { status: 400 }
      )
    }
    
    // Verify ownership and get synthesis details
    const { data: synthesis, error: getError } = await supabase
      .from('voice_synthesis_jobs')
      .select('id, user_id, audio_url')
      .eq('id', synthesisId)
      .eq('user_id', user.id)
      .single()
    
    if (getError || !synthesis) {
      return NextResponse.json(
        { error: 'Synthesis not found' },
        { status: 404 }
      )
    }
    
    // Delete audio file from storage if it exists
    if (synthesis.audio_url) {
      const { error: deleteFileError } = await supabase
        .storage
        .from('voice-memories')
        .remove([synthesis.audio_url])
      
      if (deleteFileError) {
        console.warn('Failed to delete audio file:', deleteFileError)
        // Continue with database deletion even if file deletion fails
      }
    }
    
    // Delete synthesis record
    const { error: deleteError } = await supabase
      .from('voice_synthesis_jobs')
      .delete()
      .eq('id', synthesisId)
      .eq('user_id', user.id)
    
    if (deleteError) {
      console.error('Error deleting synthesis:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete synthesis' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Synthesis deleted successfully'
    })
    
  } catch (error) {
    console.error('Unexpected error deleting synthesis:', error)
    return NextResponse.json(
      { error: 'Failed to delete synthesis' },
      { status: 500 }
    )
  }
}