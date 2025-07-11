'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mic, AlertCircle, Info, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50),
  memoryIds: z.array(z.string()).min(1, 'Select at least one recording').max(10, 'Maximum 10 recordings'),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface Memory {
  id: string
  title: string
  duration: number
  created_at: string
  file_size: number
}

export default function CreateVoiceProfile() {
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoadingMemories, setIsLoadingMemories] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCount, setSelectedCount] = useState(0)
  const [hasConsent, setHasConsent] = useState<boolean | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      memoryIds: [],
    },
  })

  const selectedMemoryIds = watch('memoryIds')

  useEffect(() => {
    checkConsent()
    fetchMemories()
  }, [])

  useEffect(() => {
    setSelectedCount(selectedMemoryIds.length)
  }, [selectedMemoryIds])

  const checkConsent = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setHasConsent(data.profile?.voice_clone_consent || false)
      }
    } catch (error) {
      console.error('Error checking consent:', error)
    }
  }

  const fetchMemories = async () => {
    try {
      const response = await fetch('/api/memories?limit=50')
      if (response.ok) {
        const data = await response.json()
        // Filter memories suitable for training (30s - 10min)
        const suitable = data.memories.filter((m: Memory) => 
          m.duration >= 30 && m.duration <= 600 && m.file_size <= 25 * 1024 * 1024
        )
        setMemories(suitable)
      }
    } catch (error) {
      console.error('Error fetching memories:', error)
    } finally {
      setIsLoadingMemories(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsCreating(true)
    setError(null)

    try {
      const response = await fetch('/api/voice-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create voice profile')
      }

      const result = await response.json()
      router.push('/account/voice-profiles')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsCreating(false)
    }
  }

  const handleMemoryToggle = (memoryId: string) => {
    const current = selectedMemoryIds || []
    if (current.includes(memoryId)) {
      setValue('memoryIds', current.filter(id => id !== memoryId))
    } else {
      setValue('memoryIds', [...current, memoryId])
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (hasConsent === false) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-warm-light/20 border border-warm-primary rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-warm-primary mx-auto mb-4" />
          <h3 className="text-heading-sm font-medium mb-2">Consent Required</h3>
          <p className="text-body-sm text-text-secondary mb-6">
            Voice cloning features require your consent. Please enable voice cloning in your account settings first.
          </p>
          <a
            href="/account/settings"
            className="inline-flex items-center px-6 py-3 bg-warm-primary text-white rounded-lg hover:bg-warm-deep transition-colors"
          >
            Go to Settings
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          disabled={isCreating}
          className="inline-flex items-center text-body-sm text-sage-primary hover:text-sage-deep transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to profiles
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-border-primary p-6">
          <h2 className="text-heading-md font-serif mb-6">Create Voice Profile</h2>

          <div className="space-y-6">
            {/* Profile Name */}
            <div>
              <label htmlFor="name" className="block text-body-sm font-medium text-text-secondary mb-2">
                Profile Name *
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                placeholder="e.g., My Natural Voice"
                className="input-field"
                disabled={isCreating}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-error-primary">{errors.name.message}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-sage-light/20 rounded-lg p-4 flex items-start space-x-3">
              <Info className="w-5 h-5 text-sage-primary flex-shrink-0 mt-0.5" />
              <div className="text-body-sm text-sage-deep">
                <p className="font-medium mb-1">Training Requirements</p>
                <ul className="space-y-1">
                  <li>• Select 1-10 recordings (more is better)</li>
                  <li>• Each recording should be 30 seconds to 10 minutes</li>
                  <li>• Clear speech without background noise works best</li>
                  <li>• Training typically takes 30-60 minutes</li>
                </ul>
              </div>
            </div>

            {/* Memory Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-body-sm font-medium text-text-secondary">
                  Select Recordings for Training *
                </label>
                <span className="text-body-sm text-text-secondary">
                  {selectedCount} selected
                </span>
              </div>

              {isLoadingMemories ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-background-secondary rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : memories.length === 0 ? (
                <div className="bg-background-secondary rounded-lg p-8 text-center">
                  <Mic className="w-8 h-8 text-text-tertiary mx-auto mb-3" />
                  <p className="text-body-sm text-text-secondary">
                    No suitable recordings found. You need recordings between 30 seconds and 10 minutes.
                  </p>
                  <a
                    href="/account/memories/new"
                    className="inline-block mt-4 text-body-sm text-sage-primary hover:text-sage-deep"
                  >
                    Create a recording →
                  </a>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {memories.map(memory => {
                    const isSelected = selectedMemoryIds.includes(memory.id)
                    return (
                      <label
                        key={memory.id}
                        className={`
                          block p-4 rounded-lg border cursor-pointer transition-all
                          ${isSelected 
                            ? 'border-sage-primary bg-sage-light/10' 
                            : 'border-border-primary hover:border-sage-light'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleMemoryToggle(memory.id)}
                          disabled={isCreating}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`
                              w-5 h-5 rounded flex items-center justify-center
                              ${isSelected 
                                ? 'bg-sage-primary' 
                                : 'bg-white border-2 border-border-primary'
                              }
                            `}>
                              {isSelected && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="text-body-sm font-medium">{memory.title}</p>
                              <p className="text-body-xs text-text-secondary">
                                {formatDuration(memory.duration)} • {new Date(memory.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}

              {errors.memoryIds && (
                <p className="mt-2 text-sm text-error-primary">{errors.memoryIds.message}</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-error-light/10 border border-error-light rounded-lg p-4">
            <p className="text-body-sm text-error-primary">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isCreating}
            className="px-6 py-2 border border-border-primary rounded-lg text-text-primary hover:bg-background-secondary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating || memories.length === 0}
            className="px-6 py-2 bg-sage-primary text-white rounded-lg hover:bg-sage-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}