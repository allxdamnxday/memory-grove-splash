import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CreateVoiceProfile from '@/components/voice/CreateVoiceProfile'

export const metadata: Metadata = {
  title: 'Create Voice Profile - Memory Grove',
  description: 'Create a new AI voice profile from your recordings',
}

export default async function NewVoiceProfilePage() {
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
      <div className="container">
        <CreateVoiceProfile />
      </div>
    </div>
  )
}