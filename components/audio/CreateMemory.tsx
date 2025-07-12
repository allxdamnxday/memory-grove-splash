'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Upload as UploadIcon, ArrowLeft, Loader2, Zap } from 'lucide-react'
import AudioRecorder from './AudioRecorder'
import AudioUploader from './AudioUploader'
import VoiceCloneGenerator from '@/components/voice/VoiceCloneGenerator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { uploadMemoryAudio } from '@/lib/utils/supabase-upload'
import { createClient } from '@/lib/supabase/client'

const memorySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
})

type MemoryFormData = z.infer<typeof memorySchema>

interface CreateMemoryProps {
  voiceProfileId?: string
}

export default function CreateMemory({ voiceProfileId }: CreateMemoryProps) {
  const router = useRouter()
  const [mode, setMode] = useState<'select' | 'record' | 'upload' | 'clone'>('select')
  const [audioFile, setAudioFile] = useState<{ blob: Blob; duration: number } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [hasVoiceProfiles, setHasVoiceProfiles] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemoryFormData>({
    resolver: zodResolver(memorySchema),
  })

  useEffect(() => {
    // Check if user has voice profiles
    const checkVoiceProfiles = async () => {
      try {
        const response = await fetch('/api/voice-profile')
        if (response.ok) {
          const data = await response.json()
          const hasReady = data.profiles?.some((p: any) => p.status === 'ready')
          setHasVoiceProfiles(hasReady || false)
        }
      } catch (error) {
        console.error('Error checking voice profiles:', error)
      }
    }
    checkVoiceProfiles()
  }, [])

  const handleRecordingComplete = useCallback((blob: Blob, duration: number) => {
    setAudioFile({ blob, duration })
  }, [])

  const handleFileSelect = useCallback((file: File, duration: number) => {
    setAudioFile({ blob: file, duration })
  }, [])

  const onSubmit = async (data: MemoryFormData) => {
    if (!audioFile) return

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Get current user
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Convert blob to file if needed
      const file = audioFile.blob instanceof File 
        ? audioFile.blob 
        : new File([audioFile.blob], 'recording.mp3', { 
            type: audioFile.blob.type || 'audio/mp3' 
          })

      // Upload audio directly to Supabase Storage
      setUploadProgress(10) // Show initial progress
      const uploadResult = await uploadMemoryAudio(
        file,
        user.id,
        (progress) => {
          // Simulate progress since Supabase doesn't provide upload progress
          setUploadProgress(10 + Math.min(progress, 80))
        }
      )

      setUploadProgress(90) // Almost done

      // Save memory metadata via API
      const response = await fetch('/api/memories/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          duration: audioFile.duration,
          audio_url: uploadResult.path,
          file_type: file.type,
          file_size: file.size
        })
      })

      if (!response.ok) {
        // If metadata save fails, try to clean up the uploaded file
        try {
          await supabase.storage
            .from('voice-memories')
            .remove([uploadResult.path])
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded file:', cleanupError)
        }
        
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save memory')
      }

      setUploadProgress(100)
      
      // Success - redirect to memories list
      router.push('/account/memories')
      router.refresh()

    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload memory. Please try again.')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const resetForm = useCallback(() => {
    setMode('select')
    setAudioFile(null)
    setError(null)
  }, [])

  if (mode === 'select') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-border-primary p-8">
          <h2 className="text-heading-lg font-serif text-center mb-8">
            Create a New Memory
          </h2>
          
          <div className={`grid ${hasVoiceProfiles ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
            <button
              onClick={() => setMode('record')}
              className="group relative p-6 bg-background-secondary rounded-lg hover:bg-sage-light/20 transition-all duration-200 border border-border-primary hover:border-sage-primary"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Mic className="w-8 h-8 text-sage-primary" />
                </div>
                <div>
                  <h3 className="text-heading-sm font-medium">Record Now</h3>
                  <p className="text-body-sm text-text-secondary mt-1">
                    Capture your voice directly
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode('upload')}
              className="group relative p-6 bg-background-secondary rounded-lg hover:bg-warm-light/20 transition-all duration-200 border border-border-primary hover:border-warm-primary"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-warm-light rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <UploadIcon className="w-8 h-8 text-warm-primary" />
                </div>
                <div>
                  <h3 className="text-heading-sm font-medium">Upload File</h3>
                  <p className="text-body-sm text-text-secondary mt-1">
                    Use an existing recording
                  </p>
                </div>
              </div>
            </button>

            {hasVoiceProfiles && (
              <button
                onClick={() => setMode('clone')}
                className="group relative p-6 bg-background-secondary rounded-lg hover:bg-sage-light/20 transition-all duration-200 border border-border-primary hover:border-sage-primary"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8 text-sage-primary" />
                  </div>
                  <div>
                    <h3 className="text-heading-sm font-medium">AI Voice</h3>
                    <p className="text-body-sm text-text-secondary mt-1">
                      Generate from text
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={resetForm}
          disabled={isUploading}
          className="inline-flex items-center text-body-sm text-sage-primary hover:text-sage-deep transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to options
        </button>
      </div>

      <div className="space-y-6">
        {mode === 'record' && !audioFile && (
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        )}

        {mode === 'upload' && !audioFile && (
          <div className="bg-white rounded-lg shadow-sm border border-border-primary p-6">
            <h2 className="text-heading-md font-serif mb-6">Upload Audio File</h2>
            <AudioUploader onFileSelect={handleFileSelect} />
          </div>
        )}

        {mode === 'clone' && (
          <VoiceCloneGenerator voiceProfileId={voiceProfileId} />
        )}

        {audioFile && mode !== 'clone' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-border-primary p-6">
              <h2 className="text-heading-md font-serif mb-6">Memory Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-body-sm font-medium text-text-secondary mb-2">
                    Title *
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    id="title"
                    placeholder="Give your memory a meaningful title"
                    className="input-field"
                    disabled={isUploading}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-error-primary">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-body-sm font-medium text-text-secondary mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    {...register('description')}
                    id="description"
                    rows={4}
                    placeholder="Add any context or notes about this memory"
                    className="input-field resize-none"
                    disabled={isUploading}
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-error-primary">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-error-light/10 border border-error-light rounded-lg p-4">
                <p className="text-body-sm text-error-primary">{error}</p>
              </div>
            )}

            {isUploading && (
              <div className="bg-sage-light/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-sm text-text-secondary">Uploading your memory...</span>
                  <span className="text-body-sm font-medium text-sage-primary">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-background-secondary rounded-full h-2">
                  <div 
                    className="bg-sage-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                disabled={isUploading}
                className="px-6 py-2 border border-border-primary rounded-lg text-text-primary hover:bg-background-secondary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 bg-sage-primary text-white rounded-lg hover:bg-sage-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Preserving...
                  </>
                ) : (
                  'Preserve Memory'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}