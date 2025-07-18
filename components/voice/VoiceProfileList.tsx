'use client'

import { useState, useEffect } from 'react'
import { Plus, AlertCircle, Loader2, Mic, Sparkles, Flower2, TreePine } from 'lucide-react'
import VoiceProfileCard from './VoiceProfileCard'
import VoiceProfileCreator from './VoiceProfileCreator'
import VoiceTrainingModal from './VoiceTrainingModal'

interface VoiceProfile {
  id: string
  name: string
  description?: string
  model_type: string
  minimax_voice_id: string
  training_status: 'pending' | 'processing' | 'completed' | 'failed'
  is_active: boolean
  created_at: string
  training_completed_at?: string
  error_message?: string
}

export default function VoiceProfileList() {
  const [profiles, setProfiles] = useState<VoiceProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreator, setShowCreator] = useState(false)
  const [profileToTrain, setProfileToTrain] = useState<VoiceProfile | null>(null)
  const [hasConsent, setHasConsent] = useState(false)
  
  useEffect(() => {
    fetchProfiles()
    checkConsent()
  }, [])
  
  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/voice/profiles')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch voice profiles')
      }
      
      setProfiles(data.profiles)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load voice profiles')
    } finally {
      setIsLoading(false)
    }
  }
  
  const checkConsent = async () => {
    try {
      const response = await fetch('/api/voice/consent')
      const data = await response.json()
      setHasConsent(data.consent_granted)
    } catch (err) {
      console.error('Failed to check consent:', err)
    }
  }
  
  const handleEdit = (profile: VoiceProfile) => {
    // TODO: Implement edit functionality
    console.log('Edit profile:', profile)
  }
  
  const handleDelete = async (profile: VoiceProfile) => {
    if (!confirm(`Are you sure you want to delete "${profile.name}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      const response = await fetch(`/api/voice/profiles/${profile.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete voice profile')
      }
      
      await fetchProfiles()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete voice profile')
    }
  }
  
  const handleToggleActive = async (profile: VoiceProfile) => {
    try {
      const response = await fetch(`/api/voice/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !profile.is_active })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update voice profile')
      }
      
      await fetchProfiles()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update voice profile')
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sage-primary" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-error-light/20 rounded-lg p-6 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-error-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-error-primary font-medium">Error loading voice profiles</p>
          <p className="text-error-primary text-body-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }
  
  if (!hasConsent) {
    return (
      <div className="bg-gradient-to-br from-warm-sand/30 to-sage-mist/20 rounded-organic p-8 text-center">
        <TreePine className="w-16 h-16 text-sage-primary mx-auto mb-4" />
        <h3 className="font-serif text-h3 text-sage-deep mb-3">Your Voice Garden Awaits</h3>
        <p className="text-text-secondary mb-6 max-w-lg mx-auto">
          Before planting your voice in this sacred garden, we need your blessing 
          to nurture and preserve its essence.
        </p>
        <a href="/account" className="btn-primary inline-block">
          Grant Your Blessing
        </a>
      </div>
    )
  }
  
  const hasTrainedVoices = profiles.some(p => p.training_status === 'completed' && p.is_active)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-h3 text-sage-deep flex items-center space-x-3">
            <span>Your Voices</span>
            <Flower2 className="w-6 h-6 text-sage-primary" />
          </h2>
          <p className="text-text-secondary text-body-sm mt-1">Each voice a seed of eternal connection</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasTrainedVoices && (
            <a
              href="/memories/voice-synthesis"
              className="inline-flex items-center justify-center px-6 py-3 bg-warm-white hover:bg-sage-mist border-2 border-sage-light text-sage-deep rounded-full shadow-sm hover:shadow-soft transition-all transform hover:scale-105 text-body-sm font-medium group"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              <span>Create Memory</span>
            </a>
          )}
          <button
            onClick={() => setShowCreator(true)}
            className="inline-flex items-center justify-center px-8 py-3 bg-sage-primary hover:bg-sage-deep text-white rounded-full shadow-soft hover:shadow-elevated transition-all transform hover:scale-105 text-body-md font-semibold group"
            disabled={profiles.length >= 5}
          >
            <Plus className="w-6 h-6 mr-2 transition-transform group-hover:rotate-90" />
            <span>Plant New Voice</span>
          </button>
        </div>
      </div>
      
      {profiles.length === 0 ? (
        <div className="bg-gradient-to-br from-sage-mist/30 to-warm-sand/20 rounded-organic p-12 text-center animate-scale-in">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-sage-light/30 rounded-organic flex items-center justify-center animate-pulse">
              <TreePine className="w-10 h-10 text-sage-primary" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-dawn rounded-full animate-bounce" />
          </div>
          <h3 className="font-serif text-h3 text-sage-deep mb-3">Your Voice Garden Awaits</h3>
          <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
            Plant the first seed of your voice, and watch it grow into a living 
            legacy that speaks across time.
          </p>
          <button
            onClick={() => setShowCreator(true)}
            className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-sage-primary to-sage-deep hover:from-sage-deep hover:to-sage-primary text-white rounded-full shadow-elevated hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-body-lg font-semibold"
          >
            <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
            Plant Your First Voice
          </button>
        </div>
      ) : (
        <>
          {profiles.length >= 5 && (
            <div className="bg-gradient-to-r from-warm-sand/30 to-accent-dawn/20 rounded-organic p-6 text-center mb-6">
              <p className="text-warm-deep text-body-sm font-medium">
                Your garden is full with 5 beautiful voices. To plant a new seed, 
                you&apos;ll need to make space by removing one.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {profiles.map(profile => (
              <VoiceProfileCard
                key={profile.id}
                profile={profile}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTrain={() => setProfileToTrain(profile)}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        </>
      )}
      
      {showCreator && (
        <VoiceProfileCreator
          onClose={() => setShowCreator(false)}
          onSuccess={() => {
            setShowCreator(false)
            fetchProfiles()
          }}
        />
      )}
      
      {profileToTrain && (
        <VoiceTrainingModal
          profile={profileToTrain}
          onClose={() => setProfileToTrain(null)}
          onSuccess={() => {
            setProfileToTrain(null)
            fetchProfiles()
          }}
        />
      )}
    </div>
  )
}