'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mic, Loader2, Volume2, Download, Zap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AudioPlayer from '@/components/audio/AudioPlayer'

const cloneSchema = z.object({
  text: z.string().min(1, 'Text is required').max(5000, 'Text is too long (max 5000 characters)'),
  voiceProfileId: z.string().uuid('Please select a voice profile'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  speed: z.number().min(0.5).max(2.0).optional(),
  pitch: z.number().min(-20).max(20).optional(),
})

type CloneFormData = z.infer<typeof cloneSchema>

interface VoiceProfile {
  id: string
  name: string
  status: string
}

interface VoiceCloneGeneratorProps {
  voiceProfileId?: string
}

export default function VoiceCloneGenerator({ voiceProfileId: propVoiceProfileId }: VoiceCloneGeneratorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedProfileId = propVoiceProfileId || searchParams.get('voiceProfileId')
  
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([])
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAudio, setGeneratedAudio] = useState<{
    url: string
    title: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CloneFormData>({
    resolver: zodResolver(cloneSchema),
    defaultValues: {
      voiceProfileId: preselectedProfileId || '',
      speed: 1.0,
      pitch: 0,
    },
  })

  const watchedText = watch('text')

  useEffect(() => {
    fetchVoiceProfiles()
  }, [])

  useEffect(() => {
    setCharCount(watchedText?.length || 0)
  }, [watchedText])

  const fetchVoiceProfiles = async () => {
    try {
      const response = await fetch('/api/voice-profile')
      if (response.ok) {
        const data = await response.json()
        const readyProfiles = data.profiles.filter((p: VoiceProfile) => p.status === 'ready')
        setVoiceProfiles(readyProfiles)
      }
    } catch (error) {
      console.error('Error fetching voice profiles:', error)
    } finally {
      setIsLoadingProfiles(false)
    }
  }

  const onSubmit = async (data: CloneFormData) => {
    setIsGenerating(true)
    setError(null)
    setGeneratedAudio(null)

    try {
      const response = await fetch('/api/memories/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate audio')
      }

      const result = await response.json()
      setGeneratedAudio({
        url: result.memory.signedUrl,
        title: data.title,
      })
      
      // Reset form but keep voice profile selected
      reset({
        voiceProfileId: data.voiceProfileId,
        speed: 1.0,
        pitch: 0,
        text: '',
        title: '',
        description: '',
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveAndRedirect = () => {
    router.push('/account/memories')
  }

  if (isLoadingProfiles) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-border-primary p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-background-secondary rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-background-secondary rounded w-2/3"></div>
              <div className="h-32 bg-background-secondary rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (voiceProfiles.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-border-primary p-8 text-center">
          <Mic className="w-12 h-12 text-sage-light mx-auto mb-4" />
          <h3 className="text-heading-sm font-medium mb-2">No Voice Profiles Ready</h3>
          <p className="text-body-sm text-text-secondary mb-6">
            You need at least one trained voice profile to generate audio
          </p>
          <a
            href="/account/voice-profiles"
            className="inline-flex items-center px-6 py-3 bg-sage-primary text-white rounded-lg hover:bg-sage-deep transition-colors"
          >
            Manage Voice Profiles
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-border-primary p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-sage-light rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-sage-primary" />
            </div>
            <h2 className="text-heading-md font-serif">Generate Voice Clone</h2>
          </div>

          <div className="space-y-6">
            {/* Voice Profile Selection */}
            <div>
              <label htmlFor="voiceProfileId" className="block text-body-sm font-medium text-text-secondary mb-2">
                Voice Profile *
              </label>
              <select
                {...register('voiceProfileId')}
                id="voiceProfileId"
                className="input-field"
                disabled={isGenerating}
              >
                <option value="">Select a voice profile</option>
                {voiceProfiles.map(profile => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
              {errors.voiceProfileId && (
                <p className="mt-2 text-sm text-error-primary">{errors.voiceProfileId.message}</p>
              )}
            </div>

            {/* Text Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="text" className="block text-body-sm font-medium text-text-secondary">
                  Text to Speak *
                </label>
                <span className={`text-body-xs ${charCount > 4500 ? 'text-error-primary' : 'text-text-tertiary'}`}>
                  {charCount} / 5000
                </span>
              </div>
              <textarea
                {...register('text')}
                id="text"
                rows={6}
                placeholder="Enter the text you want to convert to speech..."
                className="input-field resize-none"
                disabled={isGenerating}
              />
              {errors.text && (
                <p className="mt-2 text-sm text-error-primary">{errors.text.message}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-body-sm font-medium text-text-secondary mb-2">
                Memory Title *
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                placeholder="Give your generated memory a title"
                className="input-field"
                disabled={isGenerating}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-error-primary">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-body-sm font-medium text-text-secondary mb-2">
                Description (optional)
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={3}
                placeholder="Add any notes about this generated memory"
                className="input-field resize-none"
                disabled={isGenerating}
              />
            </div>

            {/* Advanced Settings */}
            <details className="border border-border-primary rounded-lg p-4">
              <summary className="cursor-pointer text-body-sm font-medium text-text-secondary">
                Advanced Settings
              </summary>
              <div className="mt-4 space-y-4">
                {/* Speed Control */}
                <div>
                  <label htmlFor="speed" className="block text-body-sm text-text-secondary mb-2">
                    Speed: {watch('speed') || 1.0}x
                  </label>
                  <input
                    {...register('speed', { valueAsNumber: true })}
                    type="range"
                    id="speed"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    className="w-full"
                    disabled={isGenerating}
                  />
                  <div className="flex justify-between text-body-xs text-text-tertiary mt-1">
                    <span>0.5x</span>
                    <span>Normal</span>
                    <span>2.0x</span>
                  </div>
                </div>

                {/* Pitch Control */}
                <div>
                  <label htmlFor="pitch" className="block text-body-sm text-text-secondary mb-2">
                    Pitch: {watch('pitch') || 0}
                  </label>
                  <input
                    {...register('pitch', { valueAsNumber: true })}
                    type="range"
                    id="pitch"
                    min="-20"
                    max="20"
                    step="1"
                    className="w-full"
                    disabled={isGenerating}
                  />
                  <div className="flex justify-between text-body-xs text-text-tertiary mt-1">
                    <span>Lower</span>
                    <span>Normal</span>
                    <span>Higher</span>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Generated Audio Player */}
        {generatedAudio && (
          <div className="bg-sage-light/20 rounded-lg p-6">
            <h3 className="text-heading-sm font-medium mb-4">Generated Audio</h3>
            <AudioPlayer
              src={generatedAudio.url}
              title={generatedAudio.title}
              showDownload={true}
              downloadUrl={generatedAudio.url}
              downloadFilename={`${generatedAudio.title}.mp3`}
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleSaveAndRedirect}
                className="px-4 py-2 bg-sage-primary text-white rounded-lg hover:bg-sage-deep transition-colors"
              >
                View in Memories
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-error-light/10 border border-error-light rounded-lg p-4">
            <p className="text-body-sm text-error-primary">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isGenerating}
            className="px-6 py-2 border border-border-primary rounded-lg text-text-primary hover:bg-background-secondary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-2 bg-sage-primary text-white rounded-lg hover:bg-sage-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Audio
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-8 bg-background-secondary rounded-lg p-6">
        <h4 className="text-body-md font-medium mb-3">Tips for Best Results</h4>
        <ul className="space-y-2 text-body-sm text-text-secondary">
          <li className="flex items-start">
            <span className="text-sage-primary mr-2">•</span>
            Write naturally as if you were speaking - include pauses and emphasis
          </li>
          <li className="flex items-start">
            <span className="text-sage-primary mr-2">•</span>
            Shorter sentences generally produce clearer speech
          </li>
          <li className="flex items-start">
            <span className="text-sage-primary mr-2">•</span>
            Generated audio will be marked with a special indicator
          </li>
          <li className="flex items-start">
            <span className="text-sage-primary mr-2">•</span>
            You can generate up to 10 voice clones per hour
          </li>
        </ul>
      </div>
    </div>
  )
}