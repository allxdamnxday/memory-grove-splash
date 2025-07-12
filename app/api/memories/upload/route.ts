import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-m4a', 'audio/m4a', 'audio/webm', 'audio/ogg']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const MIN_DURATION = 10 // 10 seconds
const MAX_DURATION = 300 // 5 minutes

// Schema for metadata-only upload
const uploadMetadataSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  duration: z.number().min(MIN_DURATION).max(MAX_DURATION),
  audio_url: z.string(), // Path in Supabase storage
  file_type: z.string(),
  file_size: z.number().max(MAX_FILE_SIZE)
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse JSON body (no longer FormData)
    const body = await request.json()
    
    // Validate request body
    const validationResult = uploadMetadataSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid request data',
        details: validationResult.error.errors 
      }, { status: 400 })
    }
    
    const { title, description, duration, audio_url, file_type, file_size } = validationResult.data

    // Validate file type
    if (!ALLOWED_AUDIO_TYPES.includes(file_type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload MP3, WAV, M4A, WebM, or OGG files.' 
      }, { status: 400 })
    }

    // Verify the file exists in storage and belongs to the user
    const expectedPath = audio_url.startsWith(user.id) ? audio_url : `${user.id}/${audio_url}`
    const { data: fileData, error: fileError } = await supabase.storage
      .from('voice-memories')
      .list(user.id, {
        search: audio_url.split('/').pop() // Search for filename
      })

    if (fileError || !fileData || fileData.length === 0) {
      return NextResponse.json({ 
        error: 'Audio file not found in storage. Please upload the file first.' 
      }, { status: 400 })
    }

    // Generate memory ID
    const memoryId = crypto.randomUUID()

    // Create memory record in database
    const { data: memory, error: dbError } = await supabase
      .from('memories')
      .insert({
        id: memoryId,
        user_id: user.id,
        title,
        description,
        audio_url: audio_url, // Use the provided storage path
        duration,
        file_size,
        file_type
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Note: We don't delete the file here since it was uploaded separately
      // The user can retry saving the metadata without re-uploading
      return NextResponse.json({ 
        error: 'Failed to save memory metadata. Your audio file is safe. Please try again.' 
      }, { status: 500 })
    }

    // Get signed URL for playback
    const { data: signedUrlData } = await supabase.storage
      .from('voice-memories')
      .createSignedUrl(audio_url, 3600) // 1 hour expiry

    return NextResponse.json({
      memory: {
        ...memory,
        signedUrl: signedUrlData?.signedUrl
      },
      message: 'Your voice memory has been preserved in your digital grove.'
    }, { status: 201 })

  } catch (error) {
    console.error('Error uploading memory:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred. Please try again.' 
    }, { status: 500 })
  }
}