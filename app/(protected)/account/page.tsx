import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AccountForm from '@/components/auth/AccountForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My Account - Memory Grove',
  description: 'Manage your Memory Grove account and profile settings.',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null // This shouldn't happen due to the layout protection
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="container-grove py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center text-sage-primary hover:text-sage-deep transition-colors text-body-sm mb-6"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
            
            <h1 className="text-h2 font-serif text-sage-deep mb-2">My Grove</h1>
            <p className="text-body text-text-secondary">
              Manage your account settings and profile
            </p>
          </div>

          <div className="bg-white shadow-soft rounded-lg p-8">
            <AccountForm user={user} />
          </div>

          <div className="mt-8 text-center">
            <form action="/api/auth/signout" method="POST" className="inline">
              <button
                type="submit"
                className="text-sage-primary hover:text-sage-deep transition-colors text-body-sm"
              >
                Sign out of your grove
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}