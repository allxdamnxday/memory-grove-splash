import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// GET /api/voice/consent - Get current consent status
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
    
    // Get user profile with consent status
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('voice_clone_consent, voice_clone_consent_date')
      .eq('id', user.id)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      return NextResponse.json(
        { error: 'Failed to fetch consent status' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      consent_granted: profile?.voice_clone_consent || false,
      consent_date: profile?.voice_clone_consent_date || null
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/voice/consent - Update consent status
const updateConsentSchema = z.object({
  consent: z.boolean()
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
    const { consent } = updateConsentSchema.parse(body)
    
    // Update consent status
    const updateData = consent 
      ? {
          voice_clone_consent: true,
          voice_clone_consent_date: new Date().toISOString()
        }
      : {
          voice_clone_consent: false,
          voice_clone_consent_date: null
        }
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
    
    if (updateError) {
      console.error('Error updating consent:', updateError)
      return NextResponse.json(
        { error: 'Failed to update consent status' },
        { status: 500 }
      )
    }
    
    // If consent is revoked, deactivate all voice profiles
    if (!consent) {
      const { error: deactivateError } = await supabase
        .from('voice_profiles')
        .update({ is_active: false })
        .eq('user_id', user.id)
      
      if (deactivateError) {
        console.error('Error deactivating voice profiles:', deactivateError)
      }
    }
    
    return NextResponse.json({
      success: true,
      consent_granted: consent,
      consent_date: consent ? new Date().toISOString() : null
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
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}