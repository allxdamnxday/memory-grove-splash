import { Metadata } from 'next'
import VoiceProfileList from '@/components/voice/VoiceProfileList'

export const metadata: Metadata = {
  title: 'Voice Profiles - Memory Groves',
  description: 'Manage your voice profiles for creating eternal voice memories'
}

export default function VoiceProfilesPage() {
  return (
    <div className="container-grove py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-h1 text-sage-deep mb-4">
            Voice Profiles
          </h1>
          <p className="text-text-secondary text-body-lg max-w-3xl">
            Create and manage voice profiles to preserve your unique voice. 
            Once trained, you can use these profiles to create new memories 
            from text, ensuring your voice lives on forever.
          </p>
        </div>
        
        <VoiceProfileList />
      </div>
    </div>
  )
}