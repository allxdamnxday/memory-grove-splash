import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AccountForm from '@/components/auth/AccountForm'
import VoiceCloneConsent from '@/components/account/VoiceCloneConsent'
import { BackNavigation, Breadcrumb } from '@/components/navigation'
import OrganicCard, { CardContent, CardHeader, CardTitle } from '@/components/ui/OrganicCard'
import { Settings, TreePine, Heart, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Grove Settings - Memory Grove',
  description: 'Tend to your sacred grove settings and nurture your digital sanctuary',
}

export default async function AccountSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-white via-sage-mist/20 to-warm-sand/30">
      <div className="container-grove py-16">
        <div className="max-w-4xl mx-auto">
          <BackNavigation 
            href="/account" 
            label="Return to My Grove"
            className="mb-6 animate-fade-in"
          />
          
          <Breadcrumb 
            items={[
              { label: 'My Grove', href: '/account' },
              { label: 'Grove Settings', icon: <Settings className="w-3.5 h-3.5" /> }
            ]}
            className="mb-8 animate-fade-in animation-delay-200"
          />
          
          <div className="mb-8 text-center animate-fade-in animation-delay-400">
            <h1 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-4">
              Grove Settings
            </h1>
            <p className="text-text-secondary text-body-lg max-w-2xl mx-auto">
              Like a gardener tending to their sanctuary, here you can nurture 
              your grove&apos;s growth and shape how your memories bloom.
            </p>
          </div>
        
          <div className="space-y-8">
            {/* Profile Settings */}
            <OrganicCard colorScheme="sage" withBlob animate="scale-in" className="overflow-visible">
              <CardHeader>
                <CardTitle className="font-serif text-h2 text-sage-deep flex items-center gap-3">
                  <TreePine className="w-6 h-6 text-sage-primary" />
                  Your Gardener Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-6">
                  The essence of who tends this sacred space—your identity in the grove.
                </p>
                <AccountForm user={user} />
              </CardContent>
            </OrganicCard>

            {/* Voice Cloning Consent */}
            <OrganicCard colorScheme="dawn" withBlob blobPosition="bottom-left" animate="scale-in" className="overflow-visible animation-delay-200">
              <CardHeader>
                <CardTitle className="font-serif text-h2 text-sage-deep flex items-center gap-3">
                  <Heart className="w-6 h-6 text-accent-dawn" />
                  Sacred Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-6">
                  Grant your blessing for the grove to preserve and nurture your voice.
                </p>
                <VoiceCloneConsent />
              </CardContent>
            </OrganicCard>

            {/* Account Actions */}
            <OrganicCard colorScheme="earth" animate="scale-in" className="animation-delay-400">
              <CardHeader>
                <CardTitle className="font-serif text-h3 text-sage-deep flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent-earth" />
                  Grove Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <a
                    href="/account/memories"
                    className="group flex items-center justify-between p-4 rounded-organic bg-gradient-to-r from-sage-mist/30 to-transparent hover:from-sage-mist/50 transition-all duration-300"
                  >
                    <span className="text-text-primary font-medium">Visit your Memory Collection</span>
                    <span className="text-sage-primary group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  <a
                    href="/memories/voice-profiles"
                    className="group flex items-center justify-between p-4 rounded-organic bg-gradient-to-r from-warm-sand/30 to-transparent hover:from-warm-sand/50 transition-all duration-300"
                  >
                    <span className="text-text-primary font-medium">Tend your Voice Garden</span>
                    <span className="text-sage-primary group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  <div className="pt-4 mt-4 border-t border-warm-pebble/30">
                    <form action="/api/auth/signout" method="POST">
                      <button
                        type="submit"
                        className="w-full text-left p-4 rounded-organic text-warm-700 hover:text-error-primary hover:bg-error-light/10 transition-all duration-300 font-medium"
                      >
                        Leave the Grove for Now
                      </button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </OrganicCard>
          </div>
        </div>
      </div>
    </div>
  )
}