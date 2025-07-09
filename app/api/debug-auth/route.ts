import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  
  // Try to get user with Supabase
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  return NextResponse.json({
    cookies: allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 50) + '...' })),
    supabaseUser: user ? { id: user.id, email: user.email } : null,
    supabaseError: error ? error.message : null,
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}