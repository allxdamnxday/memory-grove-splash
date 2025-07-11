import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import VoiceProfileList from '@/components/voice/VoiceProfileList'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Voice Profiles - Memory Grove',
  description: 'Manage your voice profiles for AI-powered voice cloning',
}

export default async function VoiceProfilesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user has consent
  const { data: profile } = await supabase
    .from('profiles')
    .select('voice_clone_consent')
    .eq('id', user.id)
    .single()

  if (!profile?.voice_clone_consent) {
    redirect('/account/settings')
  }

  return (
    <div className="min-h-screen bg-background-primary py-12">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <Link
            href="/account/memories"
            className="inline-flex items-center text-body-sm text-sage-primary hover:text-sage-deep transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to memories
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-xl font-serif">Voice Profiles</h1>
              <p className="text-body-lg text-text-secondary mt-2">
                Create and manage AI voice profiles from your recordings
              </p>
            </div>
          </div>
        </div>

        <VoiceProfileList />
      </div>
    </div>
  )
}