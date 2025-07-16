'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Mic, CheckCircle, AlertCircle, Loader2, Flower2, Sprout, TreePine, Heart, Sparkles } from 'lucide-react'

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
  // Removed polling interval - voice cloning is synchronous
  
  useEffect(() => {
    fetchMemories()
  }, [])
  
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
      
      // Voice cloning is synchronous - response indicates immediate success or failure
      if (data.status === 'completed') {
        setTrainingStatus('completed')
        // Show success for 2 seconds before closing
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else if (data.status === 'failed') {
        setTrainingStatus('failed')
        setError(data.error || 'Voice cloning failed')
        setIsTraining(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start voice training')
      setTrainingStatus('failed')
      setIsTraining(false)
    }
  }
  
  // Voice cloning is synchronous - no polling needed
  
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
      <div className="bg-gradient-to-br from-warm-white to-sage-mist/20 rounded-organic shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-sage-light/30">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-h3 text-sage-deep flex items-center space-x-3">
              <Sprout className="w-6 h-6 text-sage-primary" />
              <span>Nurture: {profile.name}</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-warm-sand/20 rounded-organic transition-all hover:rotate-90"
              aria-label="Close"
              disabled={isTraining && trainingStatus === 'processing'}
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>
        
        {trainingStatus === 'idle' && (
          <div className="p-6">
            <div className="bg-gradient-to-r from-sage-mist/40 to-warm-sand/30 rounded-organic p-6 mb-6">
              <h3 className="font-medium text-sage-deep mb-3 flex items-center space-x-2">
                <TreePine className="w-5 h-5 text-sage-primary" />
                <span>Select a Memory to Plant</span>
              </h3>
              <p className="text-body-sm text-text-secondary leading-relaxed">
                Choose a recording that captures your voice&apos;s true essence (10 seconds to 5 minutes). 
                Like seeds in rich soil, clear recordings grow the most beautiful voices.
              </p>
            </div>
            
            {error && (
              <div className="bg-gradient-to-r from-error-light/20 to-warm-sand/20 rounded-organic p-5 mb-6 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-error-primary flex-shrink-0 mt-0.5" />
                <p className="text-error-deep text-body-sm font-medium">{error}</p>
              </div>
            )}
            
            {memories.length === 0 ? (
              <div className="text-center py-12">
                <TreePine className="w-12 h-12 text-sage-primary mx-auto mb-4 animate-pulse" />
                <p className="text-text-secondary font-medium mb-2">No seeds ready for planting</p>
                <p className="text-body-sm text-text-light mb-6 max-w-sm mx-auto">
                  Your voice garden needs memories between 10 seconds and 5 minutes to grow from
                </p>
                <a href="/account/memories/new" className="btn-primary organic-seed">
                  <Heart className="w-5 h-5 mr-2 inline" />
                  Create New Memory
                </a>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                  {memories.map(memory => (
                    <label
                      key={memory.id}
                      className={`block p-5 rounded-organic border-2 cursor-pointer transition-all ${
                        selectedMemoryId === memory.id
                          ? 'border-sage-primary bg-gradient-to-r from-sage-mist/30 to-warm-sand/20 shadow-soft'
                          : 'border-warm-pebble/50 hover:border-sage-light hover:shadow-gentle'
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
                    Close
                  </button>
                  <button
                    onClick={startTraining}
                    className="btn-primary flex-1 organic-seed"
                    disabled={!selectedMemoryId}
                  >
                    <Sprout className="w-5 h-5 mr-2 inline" />
                    Nurture Voice
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        
        {trainingStatus === 'uploading' && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <Sprout className="w-16 h-16 text-sage-primary mx-auto mb-4 animate-bounce" />
              <h3 className="font-serif text-h3 text-sage-deep mb-3">
                Planting Your Voice...
              </h3>
              <p className="text-text-secondary">
                Your voice is taking root in the eternal garden
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-sage-mist/40 to-warm-sand/30 rounded-organic p-6">
              <p className="text-body-sm text-text-secondary leading-relaxed">
                Like a seed transforming into a tree, your voice is being woven 
                into the fabric of time. This magical moment takes just a breath or two.
              </p>
            </div>
          </div>
        )}
        
        {trainingStatus === 'completed' && (
          <div className="p-8 text-center animate-scale-in">
            <Flower2 className="w-20 h-20 text-sage-primary mx-auto mb-4" />
            <h3 className="font-serif text-h2 text-sage-deep mb-3">
              Your Voice Has Bloomed!
            </h3>
            <p className="text-text-secondary mb-6 text-body-lg">
              Like a flower opening to the sun, your voice is now ready to speak across time.
            </p>
            <div className="space-y-3">
              <a 
                href={`/memories/voice-synthesis?voice=${profile.id}`}
                className="btn-primary block w-full organic-seed living"
              >
                <Sparkles className="w-5 h-5 mr-2 inline" />
                Begin Speaking
              </a>
              <button onClick={onSuccess} className="btn-secondary block w-full">
                Return to Garden
              </button>
            </div>
          </div>
        )}
        
        {trainingStatus === 'failed' && (
          <div className="p-8 text-center">
            <div className="relative inline-block">
              <TreePine className="w-16 h-16 text-error-primary mx-auto mb-4" />
              <div className="absolute -bottom-2 -right-2">
                <AlertCircle className="w-6 h-6 text-error-deep" />
              </div>
            </div>
            <h3 className="font-serif text-h3 text-sage-deep mb-3">
              Your Voice Needs More Care
            </h3>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              {error || 'Sometimes gardens need extra nurturing. Let&apos;s try planting your voice again with a different memory.'}
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
                className="btn-primary flex-1 organic-seed"
              >
                <Sprout className="w-4 h-4 mr-1 inline" />
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}