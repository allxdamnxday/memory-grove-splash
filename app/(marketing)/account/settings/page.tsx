import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AccountForm from '@/components/auth/AccountForm'
import VoiceCloneConsent from '@/components/account/VoiceCloneConsent'

export const metadata: Metadata = {
  title: 'Account Settings - Memory Grove',
  description: 'Manage your Memory Grove account settings and preferences',
}

export default async function AccountSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background-primary py-12">
      <div className="container max-w-4xl">
        <h1 className="text-heading-xl font-serif mb-8">Account Settings</h1>
        
        <div className="space-y-8">
          {/* Profile Settings */}
          <div>
            <h2 className="text-heading-md font-serif mb-4">Profile Information</h2>
            <AccountForm user={user} />
          </div>

          {/* Voice Cloning Consent */}
          <div>
            <h2 className="text-heading-md font-serif mb-4">Privacy & Features</h2>
            <VoiceCloneConsent />
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-border-primary p-6">
            <h3 className="text-heading-sm font-medium mb-4">Account Actions</h3>
            <div className="space-y-4">
              <a
                href="/account/memories"
                className="block text-body-sm text-sage-primary hover:text-sage-deep"
              >
                View all memories →
              </a>
              <a
                href="/account/voice-profiles"
                className="block text-body-sm text-sage-primary hover:text-sage-deep"
              >
                Manage voice profiles →
              </a>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-body-sm text-error-primary hover:text-error-deep"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}