import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/voice/profiles/[id] - Get a specific voice profile
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Fetch voice profile
    const { data: profile, error } = await supabase
      .from('voice_profiles')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (error || !profile) {
      return NextResponse.json(
        { error: 'Voice profile not found' },
        { status: 404 }
      )
    }
    
    // Get training samples if profile is trained
    if (profile.training_status === 'completed') {
      const { data: samples } = await supabase
        .from('voice_training_samples')
        .select('*, memories!inner(*)')
        .eq('voice_profile_id', id)
      
      return NextResponse.json({ 
        profile: {
          ...profile,
          training_samples: samples || []
        }
      })
    }
    
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/voice/profiles/[id] - Update a voice profile
const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional()
})

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
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
    const validatedData = updateProfileSchema.parse(body)
    
    // Update voice profile
    const { data: updatedProfile, error } = await supabase
      .from('voice_profiles')
      .update(validatedData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (error || !updatedProfile) {
      return NextResponse.json(
        { error: 'Voice profile not found or update failed' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ profile: updatedProfile })
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

// DELETE /api/voice/profiles/[id] - Delete a voice profile
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if profile exists and belongs to user
    const { data: profile, error: fetchError } = await supabase
      .from('voice_profiles')
      .select('id, training_status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (fetchError || !profile) {
      return NextResponse.json(
        { error: 'Voice profile not found' },
        { status: 404 }
      )
    }
    
    // Check if there are any cloned memories using this profile
    const { count: clonedCount } = await supabase
      .from('memories')
      .select('*', { count: 'exact', head: true })
      .eq('source_voice_profile_id', id)
    
    if (clonedCount && clonedCount > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete voice profile with existing cloned memories',
          cloned_count: clonedCount
        },
        { status: 400 }
      )
    }
    
    // Delete voice profile (cascade will handle training samples)
    const { error: deleteError } = await supabase
      .from('voice_profiles')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    
    if (deleteError) {
      console.error('Error deleting voice profile:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete voice profile' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}