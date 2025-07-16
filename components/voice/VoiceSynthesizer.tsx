'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Volume2, Download, Save, AlertCircle, Sparkles, Loader2, Heart, Flower2, TreePine, Wind, X } from 'lucide-react'
import { MemoryOrganicCard, CardContent, CardHeader, CardTitle } from '@/components/ui/OrganicCard'
import AudioPlayer from '@/components/audio/AudioPlayer'
import { useSearchParams } from 'next/navigation'

const synthesisSchema = z.object({
  text: z.string().min(1, 'Text is required').max(5000, 'Text must be less than 5000 characters'),
  voice_profile_id: z.string().min(1, 'Please select a voice profile'),
  emotion: z.enum(['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral']).default('neutral'),
  speed: z.number().min(0.5).max(2.0).default(1.0),
  volume: z.number().min(0.1).max(10.0).default(1.0),
  pitch: z.number().min(-12).max(12).default(0)
})

type SynthesisFormData = z.infer<typeof synthesisSchema>

interface VoiceProfile {
  id: string
  name: string
  training_status: string
  is_active: boolean
}

export default function VoiceSynthesizer() {
  const searchParams = useSearchParams()
  const preselectedVoiceId = searchParams.get('voice')
  
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [synthesizedAudio, setSynthesizedAudio] = useState<{
    url: string
    duration: number
    jobId?: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SynthesisFormData>({
    resolver: zodResolver(synthesisSchema),
    defaultValues: {
      emotion: 'neutral',
      speed: 1.0,
      volume: 1.0,
      pitch: 0,
      voice_profile_id: preselectedVoiceId || ''
    }
  })
  
  // Removed save_as_memory - now handled after generation
  const textLength = watch('text')?.length || 0
  
  // Cost estimation based on character count
  const estimateCost = (characters: number) => {
    // Rough estimate: $0.02 per 1000 characters (based on TTS plan)
    return (characters / 1000) * 0.02
  }
  
  const estimatedCost = estimateCost(textLength)
  
  // Nature-inspired emotion labels
  const emotionLabels = {
    neutral: 'Peaceful',
    happy: 'Joyful',
    sad: 'Melancholic',
    angry: 'Stormy',
    fearful: 'Trembling',
    disgusted: 'Bitter',
    surprised: 'Awakened'
  }
  
  // Text preprocessing for pause markers
  const preprocessText = (text: string) => {
    // Validate and normalize pause markers
    // MiniMax supports <#x#> where x = seconds (0.01-99.99)
    return text.replace(/<#(\d+(?:\.\d{1,2})?)#>/g, (match, seconds) => {
      const pauseTime = parseFloat(seconds)
      if (pauseTime < 0.01 || pauseTime > 99.99) {
        // Invalid pause time, remove the marker
        return ''
      }
      return match // Valid pause marker, keep it
    })
  }
  
  useEffect(() => {
    fetchVoiceProfiles()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  const fetchVoiceProfiles = async () => {
    try {
      const response = await fetch('/api/voice/profiles')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch voice profiles')
      }
      
      // Filter only active and completed profiles
      const activeProfiles = data.profiles.filter((p: VoiceProfile) => 
        p.is_active && p.training_status === 'completed'
      )
      
      setVoiceProfiles(activeProfiles)
      
      // If we have a preselected voice ID and it's valid, set it
      if (preselectedVoiceId && activeProfiles.some((p: VoiceProfile) => p.id === preselectedVoiceId)) {
        setValue('voice_profile_id', preselectedVoiceId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load voice profiles')
    } finally {
      setIsLoading(false)
    }
  }
  
  const onSubmit = async (data: SynthesisFormData) => {
    setIsSynthesizing(true)
    setError(null)
    setSynthesizedAudio(null)
    
    try {
      // Preprocess text to handle pause markers
      const processedData = {
        ...data,
        text: preprocessText(data.text),
        save_as_memory: false // Never save during initial synthesis
      }
      
      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to synthesize speech')
      }
      
      setSynthesizedAudio({
        url: result.audio_url,
        duration: result.duration,
        jobId: result.synthesis_job_id
      })
      
      if (result.saved_as_memory) {
        // Show success message
        setError(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsSynthesizing(false)
    }
  }
  
  const downloadAudio = () => {
    if (!synthesizedAudio) return
    
    const link = document.createElement('a')
    link.href = synthesizedAudio.url
    link.download = `synthesis_${Date.now()}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const handleSaveAsMemory = async (title: string, description: string) => {
    if (!synthesizedAudio?.jobId) return
    
    setIsSaving(true)
    setError(null)
    
    try {
      const response = await fetch('/api/voice/synthesize/save-as-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          synthesis_job_id: synthesizedAudio.jobId,
          title,
          description
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save as memory')
      }
      
      // Close modal and show success
      setShowSaveModal(false)
      // Optionally redirect to memories page or show success message
      alert('Voice memory saved successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save memory')
    } finally {
      setIsSaving(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sage-primary" />
      </div>
    )
  }
  
  if (voiceProfiles.length === 0) {
    return (
      <div className="bg-gradient-to-br from-sage-mist/30 to-warm-sand/20 rounded-organic p-12 text-center animate-scale-in">
        <TreePine className="w-16 h-16 text-sage-primary mx-auto mb-4" />
        <h3 className="font-serif text-h3 text-sage-deep mb-3">Your Voice Garden Is Empty</h3>
        <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
          Before words can bloom into voice, you must first plant 
          the seeds of your sound in the garden.
        </p>
        <a href="/memories/voice-profiles" className="btn-primary organic-seed">
          <Sparkles className="w-5 h-5 mr-2" />
          Visit Your Voice Garden
        </a>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <MemoryOrganicCard className="overflow-visible">
        <CardHeader className="pb-8">
          <CardTitle className="font-serif text-h2 text-sage-deep flex items-center justify-center space-x-3">
            <Wind className="w-8 h-8 text-sage-primary" />
            <span>Breathe Life Into Words</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="voice_profile_id" className="block text-text-primary font-medium mb-2">
              Choose Your Voice <Heart className="w-4 h-4 text-sage-primary inline ml-1" />
            </label>
            <select
              {...register('voice_profile_id')}
              id="voice_profile_id"
              className="input-field"
            >
              <option value="">Select from your garden</option>
              {voiceProfiles.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
            {errors.voice_profile_id && (
              <p className="mt-1 text-error-primary text-body-sm">{errors.voice_profile_id.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="text" className="block text-text-primary font-medium mb-2">
              Words to Bring to Life <Sparkles className="w-4 h-4 text-accent-dawn inline ml-1" />
            </label>
            <textarea
              {...register('text')}
              id="text"
              rows={6}
              className="input-field resize-none"
              placeholder="Write the words your voice will speak across time..."
            />
            <div className="mt-1 flex justify-between text-caption">
              <span className={textLength > 4500 ? 'text-error-primary' : 'text-text-light'}>
                {textLength} / 5000 characters
              </span>
              {textLength > 0 && (
                <span className="text-sage-primary">
                  Est. cost: ${estimatedCost.toFixed(3)}
                </span>
              )}
            </div>
            
            <div className="mt-3 p-4 bg-gradient-to-r from-sage-mist/30 to-warm-sand/20 rounded-organic">
              <p className="text-caption text-text-secondary flex items-start">
                <Flower2 className="w-4 h-4 text-sage-primary mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Garden Tip:</strong> Add moments of silence like nature&apos;s pauses. Use <code className="bg-white/60 px-1.5 py-0.5 rounded text-sage-deep font-mono text-xs">&lt;#2.5#&gt;</code> for seconds of quiet (0.01-99.99). 
                Like: &ldquo;I love you... &lt;#1.5#&gt; always remember that.&rdquo;</span>
              </p>
            </div>
            
            {errors.text && (
              <p className="mt-1 text-error-primary text-body-sm">{errors.text.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="emotion" className="block text-text-primary font-medium mb-2">
                Feeling
              </label>
              <select
                {...register('emotion')}
                id="emotion"
                className="input-field"
              >
                <option value="neutral">Peaceful</option>
                <option value="happy">Joyful</option>
                <option value="sad">Melancholic</option>
                <option value="angry">Stormy</option>
                <option value="fearful">Trembling</option>
                <option value="disgusted">Bitter</option>
                <option value="surprised">Awakened</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="speed" className="block text-text-primary font-medium mb-2">
                Pace: {watch('speed') === 1 ? 'Natural' : watch('speed') < 1 ? 'Gentle' : 'Flowing'}
              </label>
              <input
                {...register('speed', { valueAsNumber: true })}
                type="range"
                id="speed"
                min="0.5"
                max="2"
                step="0.1"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="volume" className="block text-text-primary font-medium mb-2">
                Presence: {watch('volume') <= 0.5 ? 'Whisper' : watch('volume') <= 1.5 ? 'Gentle' : 'Strong'}
              </label>
              <input
                {...register('volume', { valueAsNumber: true })}
                type="range"
                id="volume"
                min="0.1"
                max="2.0"
                step="0.1"
                className="w-full"
              />
              <div className="flex justify-between text-caption text-text-light mt-1">
                <span>Whisper</span>
                <span>Gentle</span>
                <span>Strong</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="pitch" className="block text-text-primary font-medium mb-2">
                Tone: {watch('pitch') === 0 ? 'Natural' : watch('pitch') < 0 ? 'Deeper' : 'Higher'}
              </label>
              <input
                {...register('pitch', { valueAsNumber: true })}
                type="range"
                id="pitch"
                min="-12"
                max="12"
                step="1"
                className="w-full"
              />
              <div className="flex justify-between text-caption text-text-light mt-1">
                <span>Deep</span>
                <span>Natural</span>
                <span>Light</span>
              </div>
            </div>
          </div>
          
          
          {error && (
            <div className="bg-gradient-to-r from-error-light/20 to-warm-sand/20 rounded-organic p-5 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-error-primary flex-shrink-0 mt-0.5" />
              <p className="text-error-deep text-body-sm font-medium">{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center space-x-2 organic-seed living"
            disabled={isSynthesizing}
          >
            {isSynthesizing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Breathing Life Into Words...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Bring Words to Life</span>
              </>
            )}
          </button>
        </form>
        </CardContent>
      </MemoryOrganicCard>
      
      {synthesizedAudio && (
        <MemoryOrganicCard className="animate-scale-in">
          <CardContent className="p-6">
            <h3 className="font-serif text-h3 text-sage-deep mb-6 flex items-center justify-center space-x-3">
              <Flower2 className="w-6 h-6 text-sage-primary" />
              <span>Your Voice Has Spoken</span>
            </h3>
          
          <AudioPlayer
            src={synthesizedAudio.url}
            title="Synthesized Speech"
            showDownload={true}
            downloadUrl={synthesizedAudio.url}
            downloadFilename={`synthesis_${Date.now()}.mp3`}
          />
          
          <div className="mt-4 flex space-x-4">
            <button
              onClick={downloadAudio}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
            
            <button
              onClick={() => setShowSaveModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Heart className="w-5 h-5" />
              <span>Save to Memory Collection</span>
            </button>
          </div>
          </CardContent>
        </MemoryOrganicCard>
      )}
      
      {/* Save as Memory Modal */}
      {showSaveModal && synthesizedAudio && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <MemoryOrganicCard className="w-full max-w-lg animate-scale-in">
            <CardHeader className="relative">
              <button
                onClick={() => setShowSaveModal(false)}
                className="absolute right-4 top-4 text-text-secondary hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <CardTitle className="font-serif text-h3 text-sage-deep flex items-center space-x-3">
                <Heart className="w-6 h-6 text-sage-primary" />
                <span>Save to Memory Collection</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const title = formData.get('title') as string
                  const description = formData.get('description') as string
                  handleSaveAsMemory(title, description)
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="memory-title" className="block text-text-primary font-medium mb-2">
                    Memory Title <span className="text-error-primary">*</span>
                  </label>
                  <input
                    id="memory-title"
                    name="title"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Name this precious moment..."
                    defaultValue={`Voice Memory - ${new Date().toLocaleDateString()}`}
                  />
                </div>
                
                <div>
                  <label htmlFor="memory-description" className="block text-text-primary font-medium mb-2">
                    Memory Description
                  </label>
                  <textarea
                    id="memory-description"
                    name="description"
                    rows={3}
                    className="input-field resize-none"
                    placeholder="What makes this memory special?..."
                  />
                </div>
                
                <div className="bg-gradient-to-r from-sage-mist/30 to-warm-sand/20 rounded-organic p-4">
                  <p className="text-caption text-text-secondary flex items-start">
                    <Flower2 className="w-4 h-4 text-sage-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>This voice memory will be preserved in your eternal garden, ready to bloom whenever you need it.</span>
                  </p>
                </div>
                
                {error && (
                  <div className="bg-gradient-to-r from-error-light/20 to-warm-sand/20 rounded-organic p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-error-primary flex-shrink-0 mt-0.5" />
                    <p className="text-error-deep text-body-sm">{error}</p>
                  </div>
                )}
                
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(false)}
                    className="btn-secondary flex-1"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 flex items-center justify-center space-x-2"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        <span>Save Memory</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </CardContent>
          </MemoryOrganicCard>
        </div>
      )}
    </div>
  )
}