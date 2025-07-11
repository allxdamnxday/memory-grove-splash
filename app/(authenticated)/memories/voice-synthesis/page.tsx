import { Metadata } from 'next'
import VoiceSynthesizer from '@/components/voice/VoiceSynthesizer'

export const metadata: Metadata = {
  title: 'Create Voice Memory - Memory Groves',
  description: 'Transform your thoughts into voice memories using your cloned voice'
}

export default function VoiceSynthesisPage() {
  return (
    <div className="container-grove py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-h1 text-sage-deep mb-4">
          Create Voice Memory
        </h1>
        <p className="text-text-secondary text-body-lg max-w-3xl mx-auto">
          Transform your written thoughts into spoken memories using your cloned voice. 
          Share wisdom, stories, and messages that will echo through eternity.
        </p>
      </div>
      
      <VoiceSynthesizer />
    </div>
  )
}