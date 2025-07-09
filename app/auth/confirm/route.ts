import { type EmailOtpType } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/account'

  // Create absolute URL for redirects
  const origin = request.nextUrl.origin

  if (token_hash && type) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // This is fine, ignore
            }
          },
        },
      }
    )

    console.log('Attempting to verify OTP with type:', type)
    
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (error) {
      console.error('OTP verification error:', error)
      // Redirect to error page with appropriate type
      const errorUrl = new URL('/error', origin)
      errorUrl.searchParams.set('type', type === 'email' ? 'email_confirmation' : 'password_reset')
      return NextResponse.redirect(errorUrl)
    }

    console.log('OTP verification successful, session:', data.session ? 'created' : 'not created')
    
    // Successful verification - redirect to next page
    return NextResponse.redirect(new URL(next, origin))
  }

  // No token_hash or type provided
  console.error('Missing token_hash or type in confirmation request')
  return NextResponse.redirect(new URL('/error', origin))
}