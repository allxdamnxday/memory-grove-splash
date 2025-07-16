import { Metadata } from 'next'
import VoiceProfileList from '@/components/voice/VoiceProfileList'

export const metadata: Metadata = {
  title: 'Your Voice Garden - Memory Groves',
  description: 'Nurture and preserve the essence of your voice in your personal voice garden'
}

export default function VoiceProfilesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-white via-sage-mist/20 to-warm-sand/30">
      <div className="container-grove py-16">
        <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-6">
            Your Voice Garden
          </h1>
          <p className="text-text-secondary text-body-lg max-w-3xl mx-auto leading-relaxed">
            Like seeds in a sacred garden, your voice holds the power to bloom across time. 
            Plant your voice here, nurture it with care, and watch it grow into a living 
            legacy that speaks when words are needed most.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-2 text-sage-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18m0-18c-1.5 0-3 1.5-3 3s1.5 3 3 3m0-6c1.5 0 3 1.5 3 3s-1.5 3-3 3m0 6c-3 0-5.5 2.5-5.5 5.5S9 21 12 21s5.5-2.5 5.5-5.5S15 12 12 12z" />
            </svg>
            <span className="text-body-sm font-medium">Each voice is a seed of eternal connection</span>
          </div>
        </div>
        
        <VoiceProfileList />
        </div>
      </div>
    </div>
  )
}