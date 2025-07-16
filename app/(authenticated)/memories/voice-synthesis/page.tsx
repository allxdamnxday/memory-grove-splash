import { Metadata } from 'next'
import VoiceSynthesizer from '@/components/voice/VoiceSynthesizer'
import SynthesisHistory from '@/components/voice/SynthesisHistory'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Voice Memories - Memory Groves',
  description: 'Breathe life into your words and create eternal voice memories from the garden of your preserved voice'
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
    <div className="min-h-screen bg-gradient-to-b from-warm-white via-sage-mist/20 to-warm-sand/30">
      <div className="container-grove py-16">
      <div className="mb-12 text-center animate-fade-in">
        <h1 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-6">
          Voice Memories
        </h1>
        <p className="text-text-secondary text-body-lg max-w-3xl mx-auto leading-relaxed mb-6">
          Your voice lives on, ready to speak the words your heart holds. Transform 
          written thoughts into living memories, each one a gift waiting to bloom 
          in moments when your presence is needed most.
        </p>
        <div className="flex items-center justify-center space-x-3 text-sage-primary mb-8">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-body-sm font-medium">Every word becomes a lasting embrace</span>
        </div>
        <div>
          <a 
            href="/memories/voice-profiles" 
            className="inline-flex items-center text-sage-primary hover:text-sage-deep transition-all hover:translate-x-[-4px] text-body-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Return to Voice Garden
          </a>
        </div>
      </div>
      
      <div className="space-y-12">
        {/* Voice Creation */}
        <section className="animate-scale-in">
          <VoiceSynthesizer />
        </section>
        
        {/* Memory Collection */}
        <section className="animate-scale-in animation-delay-400">
          <SynthesisHistory voiceProfiles={voiceProfiles || []} />
        </section>
      </div>
      </div>
    </div>
  )
}