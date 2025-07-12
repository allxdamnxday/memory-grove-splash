'use client'

import { useState, useEffect } from 'react'
import { Plus, AlertCircle, Loader2, Mic } from 'lucide-react'
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
      <div className="bg-warm-sand/20 rounded-lg p-6">
        <h3 className="font-serif text-h4 text-sage-deep mb-2">Voice Cloning Consent Required</h3>
        <p className="text-text-secondary mb-4">
          To use voice cloning features, you need to grant consent in your account settings.
        </p>
        <a href="/account" className="btn-primary inline-block">
          Go to Account Settings
        </a>
      </div>
    )
  }
  
  const hasTrainedVoices = profiles.some(p => p.training_status === 'completed' && p.is_active)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-h3 text-sage-deep">Voice Profiles</h2>
        <div className="flex items-center space-x-3">
          {hasTrainedVoices && (
            <a
              href="/memories/voice-synthesis"
              className="btn-secondary flex items-center space-x-2"
            >
              <Mic className="w-5 h-5" />
              <span>Create Voice Memory</span>
            </a>
          )}
          <button
            onClick={() => setShowCreator(true)}
            className="btn-primary flex items-center space-x-2"
            disabled={profiles.length >= 5}
          >
            <Plus className="w-5 h-5" />
            <span>Create Profile</span>
          </button>
        </div>
      </div>
      
      {profiles.length === 0 ? (
        <div className="bg-sage-mist/30 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-sage-mist rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-sage-primary" />
          </div>
          <h3 className="font-serif text-h4 text-sage-deep mb-2">No Voice Profiles Yet</h3>
          <p className="text-text-secondary mb-6">
            Create your first voice profile to start cloning your voice for eternal memories.
          </p>
          <button
            onClick={() => setShowCreator(true)}
            className="btn-primary"
          >
            Create Your First Profile
          </button>
        </div>
      ) : (
        <>
          {profiles.length >= 5 && (
            <div className="bg-warm-sand/20 rounded-lg p-4">
              <p className="text-warm-primary text-body-sm">
                You&apos;ve reached the maximum of 5 voice profiles. Delete an existing profile to create a new one.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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