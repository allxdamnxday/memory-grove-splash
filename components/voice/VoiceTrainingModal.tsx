'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Mic, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface VoiceProfile {
  id: string
  name: string
  minimax_voice_id: string
}

interface Memory {
  id: string
  title: string
  duration: number
  created_at: string
}

interface VoiceTrainingModalProps {
  profile: VoiceProfile
  onClose: () => void
  onSuccess: () => void
}

export default function VoiceTrainingModal({ profile, onClose, onSuccess }: VoiceTrainingModalProps) {
  const [memories, setMemories] = useState<Memory[]>([])
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'failed'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    fetchMemories()
    
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [pollingInterval])
  
  const fetchMemories = async () => {
    try {
      const response = await fetch('/api/memories?limit=50')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch memories')
      }
      
      // Filter memories that are within the duration requirements (10s - 5min)
      const validMemories = data.memories.filter((m: Memory) => 
        m.duration >= 10 && m.duration <= 300
      )
      
      setMemories(validMemories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memories')
    } finally {
      setIsLoading(false)
    }
  }
  
  const startTraining = async () => {
    if (!selectedMemoryId) return
    
    setIsTraining(true)
    setTrainingStatus('uploading')
    setError(null)
    
    try {
      const response = await fetch('/api/voice/clone/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voice_profile_id: profile.id,
          memory_id: selectedMemoryId
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start voice training')
      }
      
      if (data.status === 'completed') {
        setTrainingStatus('completed')
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        setTrainingStatus('processing')
        // Start polling for status
        startPolling()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start voice training')
      setTrainingStatus('failed')
      setIsTraining(false)
    }
  }
  
  const startPolling = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/voice/clone/status?voice_profile_id=${profile.id}`)
        const data = await response.json()
        
        if (data.status === 'completed') {
          setTrainingStatus('completed')
          clearInterval(interval)
          setTimeout(() => {
            onSuccess()
          }, 2000)
        } else if (data.status === 'failed') {
          setTrainingStatus('failed')
          setError(data.error_message || 'Voice training failed')
          clearInterval(interval)
          setIsTraining(false)
        }
      } catch (err) {
        console.error('Failed to check training status:', err)
      }
    }, 3000) // Poll every 3 seconds
    
    setPollingInterval(interval)
  }
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Loader2 className="w-8 h-8 animate-spin text-sage-primary" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-warm-pebble/20">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-h3 text-sage-deep">
              Train Voice Profile: {profile.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-warm-sand/20 rounded-lg transition-colors"
              aria-label="Close"
              disabled={isTraining && trainingStatus === 'processing'}
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>
        
        {trainingStatus === 'idle' && (
          <div className="p-6">
            <div className="bg-sage-mist/30 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-sage-deep mb-2">Select a Voice Sample</h3>
              <p className="text-body-sm text-text-secondary">
                Choose a recording between 10 seconds and 5 minutes that best represents your natural voice.
                The higher quality the recording, the better the voice clone will be.
              </p>
            </div>
            
            {error && (
              <div className="bg-error-light/20 rounded-lg p-4 mb-6 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-error-primary flex-shrink-0 mt-0.5" />
                <p className="text-error-primary text-body-sm">{error}</p>
              </div>
            )}
            
            {memories.length === 0 ? (
              <div className="text-center py-8">
                <Mic className="w-12 h-12 text-text-light mx-auto mb-4" />
                <p className="text-text-secondary mb-4">
                  No suitable voice recordings found. You need a recording between 10 seconds and 5 minutes.
                </p>
                <a href="/account/memories/new" className="btn-primary">
                  Record New Sample
                </a>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                  {memories.map(memory => (
                    <label
                      key={memory.id}
                      className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedMemoryId === memory.id
                          ? 'border-sage-primary bg-sage-mist/20'
                          : 'border-warm-pebble/20 hover:border-sage-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="memory"
                        value={memory.id}
                        checked={selectedMemoryId === memory.id}
                        onChange={(e) => setSelectedMemoryId(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-text-primary">{memory.title}</h4>
                          <p className="text-body-sm text-text-secondary">
                            Duration: {formatDuration(memory.duration)}
                          </p>
                        </div>
                        {selectedMemoryId === memory.id && (
                          <CheckCircle className="w-5 h-5 text-sage-primary" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={onClose}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startTraining}
                    className="btn-primary flex-1"
                    disabled={!selectedMemoryId}
                  >
                    Start Training
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        
        {(trainingStatus === 'uploading' || trainingStatus === 'processing') && (
          <div className="p-6 text-center">
            <div className="mb-6">
              <Loader2 className="w-16 h-16 text-sage-primary mx-auto mb-4 animate-spin" />
              <h3 className="font-serif text-h4 text-sage-deep mb-2">
                {trainingStatus === 'uploading' ? 'Uploading Voice Sample...' : 'Training Voice Profile...'}
              </h3>
              <p className="text-text-secondary">
                {trainingStatus === 'uploading' 
                  ? 'Preparing your voice sample for training'
                  : 'This typically takes about 30 seconds. Please wait...'}
              </p>
            </div>
            
            <div className="bg-sage-mist/30 rounded-lg p-4">
              <p className="text-body-sm text-text-secondary">
                Your voice is being analyzed and cloned using advanced AI technology.
                The window will close automatically when training is complete.
              </p>
            </div>
          </div>
        )}
        
        {trainingStatus === 'completed' && (
          <div className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-sage-primary mx-auto mb-4" />
            <h3 className="font-serif text-h4 text-sage-deep mb-2">
              Voice Training Complete!
            </h3>
            <p className="text-text-secondary mb-6">
              Your voice profile has been successfully trained and is ready to use.
            </p>
            <button onClick={onSuccess} className="btn-primary">
              Continue
            </button>
          </div>
        )}
        
        {trainingStatus === 'failed' && (
          <div className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-error-primary mx-auto mb-4" />
            <h3 className="font-serif text-h4 text-sage-deep mb-2">
              Training Failed
            </h3>
            <p className="text-text-secondary mb-4">
              {error || 'An error occurred while training your voice profile.'}
            </p>
            <div className="flex space-x-4">
              <button onClick={onClose} className="btn-secondary flex-1">
                Close
              </button>
              <button 
                onClick={() => {
                  setTrainingStatus('idle')
                  setError(null)
                  setIsTraining(false)
                }} 
                className="btn-primary flex-1"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}