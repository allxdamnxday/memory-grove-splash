'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Volume2, Download, Save, AlertCircle, Sparkles, Loader2 } from 'lucide-react'
import AudioPlayer from '@/components/audio/AudioPlayer'

const synthesisSchema = z.object({
  text: z.string().min(1, 'Text is required').max(5000, 'Text must be less than 5000 characters'),
  voice_profile_id: z.string().min(1, 'Please select a voice profile'),
  emotion: z.enum(['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral']).default('neutral'),
  speed: z.number().min(0.5).max(2.0).default(1.0),
  volume: z.number().min(0.1).max(10.0).default(1.0),
  pitch: z.number().min(-12).max(12).default(0),
  save_as_memory: z.boolean().default(false),
  memory_title: z.string().optional(),
  memory_description: z.string().optional()
})

type SynthesisFormData = z.infer<typeof synthesisSchema>

interface VoiceProfile {
  id: string
  name: string
  training_status: string
  is_active: boolean
}

export default function VoiceSynthesizer() {
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [synthesizedAudio, setSynthesizedAudio] = useState<{
    url: string
    duration: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SynthesisFormData>({
    resolver: zodResolver(synthesisSchema),
    defaultValues: {
      emotion: 'neutral',
      speed: 1.0,
      volume: 1.0,
      pitch: 0,
      save_as_memory: false
    }
  })
  
  const saveAsMemory = watch('save_as_memory')
  const textLength = watch('text')?.length || 0
  
  // Cost estimation based on character count
  const estimateCost = (characters: number) => {
    // Rough estimate: $0.02 per 1000 characters (based on TTS plan)
    return (characters / 1000) * 0.02
  }
  
  const estimatedCost = estimateCost(textLength)
  
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
  }, [])
  
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
        text: preprocessText(data.text)
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
        duration: result.duration
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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sage-primary" />
      </div>
    )
  }
  
  if (voiceProfiles.length === 0) {
    return (
      <div className="bg-sage-mist/30 rounded-lg p-8 text-center">
        <Volume2 className="w-16 h-16 text-sage-primary mx-auto mb-4" />
        <h3 className="font-serif text-h4 text-sage-deep mb-2">No Voice Profiles Available</h3>
        <p className="text-text-secondary mb-6">
          You need to create and train a voice profile before you can synthesize speech.
        </p>
        <a href="/memories/voice-profiles" className="btn-primary">
          Manage Voice Profiles
        </a>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h2 className="font-serif text-h3 text-sage-deep mb-6">Create Voice Memory</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="voice_profile_id" className="block text-text-primary font-medium mb-2">
              Voice Profile *
            </label>
            <select
              {...register('voice_profile_id')}
              id="voice_profile_id"
              className="input-field"
            >
              <option value="">Select a voice profile</option>
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
              Text to Speak *
            </label>
            <textarea
              {...register('text')}
              id="text"
              rows={6}
              className="input-field resize-none"
              placeholder="Enter the text you want to convert to speech..."
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
            
            <div className="mt-2 p-3 bg-sage-mist/20 rounded-lg">
              <p className="text-caption text-text-secondary">
                💡 <strong>Tip:</strong> Add pauses to your speech using <code className="bg-white px-1 rounded text-sage-deep">&lt;#2.5#&gt;</code> where the number is seconds (0.01-99.99). 
                Example: &ldquo;Hello there. &lt;#1.5#&gt; How are you today?&rdquo;
              </p>
            </div>
            
            {errors.text && (
              <p className="mt-1 text-error-primary text-body-sm">{errors.text.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="emotion" className="block text-text-primary font-medium mb-2">
                Emotion
              </label>
              <select
                {...register('emotion')}
                id="emotion"
                className="input-field"
              >
                <option value="neutral">Neutral</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
                <option value="fearful">Fearful</option>
                <option value="disgusted">Disgusted</option>
                <option value="surprised">Surprised</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="speed" className="block text-text-primary font-medium mb-2">
                Speed: {watch('speed')}x
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
                Volume: {watch('volume')}
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
                <span>Quiet</span>
                <span>Normal</span>
                <span>Loud</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="pitch" className="block text-text-primary font-medium mb-2">
                Pitch: {watch('pitch') > 0 ? '+' : ''}{watch('pitch')}
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
                <span>Lower</span>
                <span>Natural</span>
                <span>Higher</span>
              </div>
            </div>
          </div>
          
          <div className="bg-sage-mist/30 rounded-lg p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                {...register('save_as_memory')}
                type="checkbox"
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="font-medium text-sage-deep">Save as Memory</div>
                <p className="text-body-sm text-text-secondary">
                  Save this synthesized audio to your memories collection
                </p>
              </div>
            </label>
            
            {saveAsMemory && (
              <div className="mt-4 space-y-4 pl-6">
                <div>
                  <label htmlFor="memory_title" className="block text-text-primary font-medium mb-2">
                    Memory Title
                  </label>
                  <input
                    {...register('memory_title')}
                    type="text"
                    id="memory_title"
                    className="input-field"
                    placeholder="Give this memory a title..."
                  />
                </div>
                
                <div>
                  <label htmlFor="memory_description" className="block text-text-primary font-medium mb-2">
                    Memory Description
                  </label>
                  <textarea
                    {...register('memory_description')}
                    id="memory_description"
                    rows={2}
                    className="input-field resize-none"
                    placeholder="Add a description..."
                  />
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="bg-error-light/20 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-error-primary flex-shrink-0 mt-0.5" />
              <p className="text-error-primary text-body-sm">{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center space-x-2"
            disabled={isSynthesizing}
          >
            {isSynthesizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Speech...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Speech</span>
              </>
            )}
          </button>
        </form>
      </div>
      
      {synthesizedAudio && (
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h3 className="font-serif text-h4 text-sage-deep mb-4">Generated Audio</h3>
          
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
            
            {!saveAsMemory && (
              <button
                onClick={() => window.location.href = '/memories'}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>View in Memories</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}