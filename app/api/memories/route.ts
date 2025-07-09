import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Fetch memories with pagination
    const { data: memories, error: fetchError, count } = await supabase
      .from('memories')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json({ 
        error: 'Failed to retrieve memories.' 
      }, { status: 500 })
    }

    // Generate signed URLs for each memory
    const memoriesWithUrls = await Promise.all(
      (memories || []).map(async (memory) => {
        const { data: signedUrlData } = await supabase.storage
          .from('voice-memories')
          .createSignedUrl(memory.audio_url, 3600) // 1 hour expiry

        return {
          ...memory,
          signedUrl: signedUrlData?.signedUrl
        }
      })
    )

    return NextResponse.json({
      memories: memoriesWithUrls,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching memories:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred.' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get memory ID from query
    const searchParams = request.nextUrl.searchParams
    const memoryId = searchParams.get('id')

    if (!memoryId) {
      return NextResponse.json({ error: 'Memory ID is required' }, { status: 400 })
    }

    // Get memory to verify ownership and get file path
    const { data: memory, error: fetchError } = await supabase
      .from('memories')
      .select('audio_url, user_id')
      .eq('id', memoryId)
      .single()

    if (fetchError || !memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 })
    }

    if (memory.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete from storage first
    const { error: storageError } = await supabase.storage
      .from('voice-memories')
      .remove([memory.audio_url])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('memories')
      .delete()
      .eq('id', memoryId)

    if (deleteError) {
      console.error('Database deletion error:', deleteError)
      return NextResponse.json({ 
        error: 'Failed to delete memory.' 
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Memory has been removed from your grove.'
    })

  } catch (error) {
    console.error('Error deleting memory:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred.' 
    }, { status: 500 })
  }
}