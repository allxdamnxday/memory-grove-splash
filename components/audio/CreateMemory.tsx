'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Upload as UploadIcon, ArrowLeft, Loader2 } from 'lucide-react'
import AudioRecorder from './AudioRecorder'
import AudioUploader from './AudioUploader'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const memorySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
})

type MemoryFormData = z.infer<typeof memorySchema>

export default function CreateMemory() {
  const router = useRouter()
  const [mode, setMode] = useState<'select' | 'record' | 'upload'>('select')
  const [audioFile, setAudioFile] = useState<{ blob: Blob; duration: number } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemoryFormData>({
    resolver: zodResolver(memorySchema),
  })

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
      const formData = new FormData()
      
      // Convert blob to file if needed
      const file = audioFile.blob instanceof File 
        ? audioFile.blob 
        : new File([audioFile.blob], 'recording.webm', { type: 'audio/webm' })
      
      formData.append('file', file)
      formData.append('title', data.title)
      if (data.description) {
        formData.append('description', data.description)
      }
      formData.append('duration', audioFile.duration.toString())

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest()

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
        }
      })

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText)
          router.push('/account/memories')
          router.refresh()
        } else {
          const errorData = JSON.parse(xhr.responseText)
          setError(errorData.error || 'Failed to upload memory')
          setIsUploading(false)
        }
      })

      // Handle errors
      xhr.addEventListener('error', () => {
        setError('Network error occurred. Please try again.')
        setIsUploading(false)
      })

      // Send request
      xhr.open('POST', '/api/memories/upload')
      xhr.send(formData)

    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload memory. Please try again.')
      setIsUploading(false)
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
          
          <div className="grid md:grid-cols-2 gap-6">
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

        {audioFile && (
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