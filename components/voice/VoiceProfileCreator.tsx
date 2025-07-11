'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Mic, Upload, AlertCircle, Loader2 } from 'lucide-react'

const createProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  model_type: z.enum(['speech-02-hd', 'speech-02-turbo']).default('speech-02-hd')
})

type CreateProfileFormData = z.infer<typeof createProfileSchema>

interface VoiceProfileCreatorProps {
  onClose: () => void
  onSuccess: () => void
}

export default function VoiceProfileCreator({ onClose, onSuccess }: VoiceProfileCreatorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateProfileFormData>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      model_type: 'speech-02-hd'
    }
  })
  
  const onSubmit = async (data: CreateProfileFormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/voice/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create voice profile')
      }
      
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-warm-pebble/20">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-h3 text-sage-deep">Create Voice Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-warm-sand/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="bg-sage-mist/30 rounded-lg p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <Mic className="w-5 h-5 text-sage-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-sage-deep mb-1">Voice Cloning Setup</h3>
                <p className="text-body-sm text-text-secondary">
                  After creating this profile, you&apos;ll need to upload or record a voice sample 
                  (10 seconds to 5 minutes) to train your voice model.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-text-primary font-medium mb-2">
              Profile Name *
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="input-field"
              placeholder="e.g., My Natural Voice"
            />
            {errors.name && (
              <p className="mt-1 text-error-primary text-body-sm">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-text-primary font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="input-field resize-none"
              placeholder="Add notes about this voice profile..."
            />
            {errors.description && (
              <p className="mt-1 text-error-primary text-body-sm">{errors.description.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-text-primary font-medium mb-2">
              Model Quality
            </label>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  {...register('model_type')}
                  type="radio"
                  value="speech-02-hd"
                  className="mt-0.5"
                />
                <div>
                  <div className="font-medium text-text-primary">HD Quality</div>
                  <p className="text-body-sm text-text-secondary">
                    Highest quality voice cloning with best similarity
                  </p>
                </div>
              </label>
              
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  {...register('model_type')}
                  type="radio"
                  value="speech-02-turbo"
                  className="mt-0.5"
                />
                <div>
                  <div className="font-medium text-text-primary">Turbo</div>
                  <p className="text-body-sm text-text-secondary">
                    Faster processing, suitable for real-time applications
                  </p>
                </div>
              </label>
            </div>
          </div>
          
          {error && (
            <div className="bg-error-light/20 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-error-primary flex-shrink-0 mt-0.5" />
              <p className="text-error-primary text-body-sm">{error}</p>
            </div>
          )}
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Profile</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}