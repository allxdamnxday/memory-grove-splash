import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if email already exists
    const { data: existing } = await supabase
      .from('subscribers')
      .select('email')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { message: 'You are already part of our grove!' },
        { status: 200 }
      )
    }

    // Insert new subscriber
    const { error } = await supabase
      .from('subscribers')
      .insert([
        {
          email,
          subscribed_at: new Date().toISOString(),
          source: 'landing_page',
        }
      ])

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'The seed couldn\'t find its place. Please try again.' },
        { status: 500 }
      )
    }

    // TODO: Send welcome email using Resend
    // await sendWelcomeEmail(email)

    return NextResponse.json(
      { message: 'Your seed has been planted. Welcome to the grove!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'The grove is resting. Please try again later.' },
      { status: 500 }
    )
  }
}