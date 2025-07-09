import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  // If user is already logged in, redirect to account
  if (!error && user) {
    redirect('/account')
  }

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-sage-mist flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-10 h-10 text-sage-deep"
              >
                <path d="M12 2C7 2 4 5 4 9c0 4 4 12 8 12s8-8 8-12c0-4-3-7-8-7z" />
                <path d="M12 2v19M8 7c0 3 1.5 5 4 5s4-2 4-5" />
              </svg>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}