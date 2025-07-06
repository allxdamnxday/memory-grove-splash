import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, type } = await request.json()

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Store contact submission in database
    const { error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          subject,
          message,
          type: type || 'general',
          submitted_at: new Date().toISOString(),
        }
      ])

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'The message couldn\'t find its way. Please try again.' },
        { status: 500 }
      )
    }

    // TODO: Send notification email using Resend
    // await sendNotificationEmail({ name, email, subject, message, type })
    // await sendConfirmationEmail(email, name)

    return NextResponse.json(
      { message: 'Your message has been planted in our grove.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json(
      { error: 'The grove is resting. Please try again later.' },
      { status: 500 }
    )
  }
}