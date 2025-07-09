import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-m4a', 'audio/m4a', 'audio/webm']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const MIN_DURATION = 10 // 10 seconds
const MAX_DURATION = 300 // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const duration = parseInt(formData.get('duration') as string || '0')

    // Validate inputs
    if (!file || !title) {
      return NextResponse.json({ error: 'File and title are required' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload MP3, WAV, M4A, or WebM files.' 
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 50MB.' 
      }, { status: 400 })
    }

    // Validate duration
    if (duration < MIN_DURATION || duration > MAX_DURATION) {
      return NextResponse.json({ 
        error: `Audio duration must be between ${MIN_DURATION} seconds and ${MAX_DURATION / 60} minutes.` 
      }, { status: 400 })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const memoryId = crypto.randomUUID()
    const fileName = `${memoryId}.${fileExt}`
    const filePath = `${user.id}/${memoryId}/${fileName}`

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('voice-memories')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ 
        error: 'Failed to upload audio file. Please try again.' 
      }, { status: 500 })
    }

    // Create memory record in database
    const { data: memory, error: dbError } = await supabase
      .from('memories')
      .insert({
        id: memoryId,
        user_id: user.id,
        title,
        description,
        audio_url: filePath,
        duration,
        file_size: file.size,
        file_type: file.type
      })
      .select()
      .single()

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('voice-memories').remove([filePath])
      console.error('Database error:', dbError)
      return NextResponse.json({ 
        error: 'Failed to save memory. Please try again.' 
      }, { status: 500 })
    }

    // Get signed URL for playback
    const { data: signedUrlData } = await supabase.storage
      .from('voice-memories')
      .createSignedUrl(filePath, 3600) // 1 hour expiry

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