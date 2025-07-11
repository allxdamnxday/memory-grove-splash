import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// GET /api/voice/profiles - List user's voice profiles
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
    
    // Fetch voice profiles
    const { data: profiles, error } = await supabase
      .from('voice_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching voice profiles:', error)
      return NextResponse.json(
        { error: 'Failed to fetch voice profiles' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ profiles })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/voice/profiles - Create a new voice profile
const createProfileSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  model_type: z.enum(['speech-02-hd', 'speech-02-turbo']).default('speech-02-hd')
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
    
    // Check voice clone consent
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('voice_clone_consent')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile?.voice_clone_consent) {
      return NextResponse.json(
        { error: 'Voice cloning consent not granted' },
        { status: 403 }
      )
    }
    
    // Validate request body
    const body = await request.json()
    const validatedData = createProfileSchema.parse(body)
    
    // Check user's voice profile limit (e.g., 5 profiles max)
    const { count, error: countError } = await supabase
      .from('voice_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true)
    
    if (countError) {
      console.error('Error counting voice profiles:', countError)
      return NextResponse.json(
        { error: 'Failed to check profile limit' },
        { status: 500 }
      )
    }
    
    if (count && count >= 5) {
      return NextResponse.json(
        { error: 'Maximum number of voice profiles reached (5)' },
        { status: 400 }
      )
    }
    
    // Generate unique voice ID for MiniMax
    // Must start with letter, be 8+ chars, and only contain alphanumeric
    const timestamp = Date.now().toString(36)
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const voiceId = `voice${timestamp}${randomSuffix}`
    
    // Create voice profile
    const { data: newProfile, error: createError } = await supabase
      .from('voice_profiles')
      .insert({
        user_id: user.id,
        name: validatedData.name,
        description: validatedData.description,
        model_type: validatedData.model_type,
        minimax_voice_id: voiceId,
        training_status: 'pending',
        is_active: true
      })
      .select()
      .single()
    
    if (createError) {
      console.error('Error creating voice profile:', createError)
      return NextResponse.json(
        { error: 'Failed to create voice profile' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ profile: newProfile }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}