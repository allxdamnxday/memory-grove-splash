import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AccountForm from '@/components/auth/AccountForm'
import VoiceCloneConsent from '@/components/voice/VoiceCloneConsent'
import Link from 'next/link'
import { FileAudio, User, Mic, Sparkles } from 'lucide-react'
import OrganicCard, { CardContent } from '@/components/ui/OrganicCard'
import Card from '@/components/ui/Card'

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

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Link href="/account/memories">
              <OrganicCard 
                colorScheme="sage"
                withBlob
                className="group cursor-pointer"
                animationDelay={0}
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <FileAudio className="w-5 h-5 mr-2 text-sage-primary" />
                        <h3 className="text-heading-sm font-serif text-sage-deep">Voice Memories</h3>
                      </div>
                      <p className="text-body-sm text-text-secondary">
                        Record and manage your preserved memories
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-text-tertiary group-hover:text-sage-primary transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </OrganicCard>
            </Link>

            <Link href="/memories/voice-profiles">
              <OrganicCard 
                colorScheme="dawn"
                withBlob
                blobPosition="center"
                className="group cursor-pointer"
                animationDelay={100}
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <Mic className="w-5 h-5 mr-2 text-accent-dawn" />
                        <h3 className="text-heading-sm font-serif text-sage-deep">Voice Profiles</h3>
                      </div>
                      <p className="text-body-sm text-text-secondary">
                        Create and manage voice clones
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-text-tertiary group-hover:text-accent-dawn transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </OrganicCard>
            </Link>

            <Link href="/memories/voice-synthesis">
              <OrganicCard 
                colorScheme="earth"
                withBlob
                blobPosition="bottom-left"
                className="group cursor-pointer"
                animationDelay={200}
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <Sparkles className="w-5 h-5 mr-2 text-accent-earth" />
                        <h3 className="text-heading-sm font-serif text-sage-deep">Voice Synthesis</h3>
                      </div>
                      <p className="text-body-sm text-text-secondary">
                        Create speech with your cloned voices
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-text-tertiary group-hover:text-accent-earth transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </OrganicCard>
            </Link>

            <OrganicCard 
              variant="bordered"
              className="opacity-50 cursor-not-allowed"
              animationDelay={300}
              interactive={false}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <User className="w-5 h-5 mr-2 text-text-tertiary" />
                      <h3 className="text-heading-sm font-serif text-text-tertiary">Profile Settings</h3>
                    </div>
                    <p className="text-body-sm text-text-tertiary">
                      Update your account information
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </OrganicCard>
          </div>

          <Card shape="organic" variant="nature" padding="lg" animate="fade-in" animationDelay={400}>
            <h2 className="text-heading-md font-serif text-sage-deep mb-6">Account Settings</h2>
            <AccountForm user={user} />
          </Card>

          <div className="mt-6">
            <VoiceCloneConsent />
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