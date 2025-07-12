import { Metadata } from 'next'
import VoiceSynthesizer from '@/components/voice/VoiceSynthesizer'
import SynthesisHistory from '@/components/voice/SynthesisHistory'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Voice Synthesis - Memory Groves',
  description: 'Create new voice memories and view your synthesis history using your cloned voice'
}

export default async function VoiceSynthesisPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }
  
  // Fetch user's voice profiles for the history component
  const { data: voiceProfiles } = await supabase
    .from('voice_profiles')
    .select('id, name, minimax_voice_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .eq('training_status', 'completed')
    .order('name')

  return (
    <div className="container-grove py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-h1 text-sage-deep mb-4">
          Voice Synthesis
        </h1>
        <p className="text-text-secondary text-body-lg max-w-3xl mx-auto">
          Transform your written thoughts into spoken memories using your cloned voice. 
          Create new voice content and revisit your synthesis history.
        </p>
      </div>
      
      <div className="space-y-12">
        {/* Synthesis Form */}
        <section>
          <VoiceSynthesizer />
        </section>
        
        {/* Synthesis History */}
        <section>
          <SynthesisHistory voiceProfiles={voiceProfiles || []} />
        </section>
      </div>
    </div>
  )
}