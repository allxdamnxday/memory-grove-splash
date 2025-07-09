'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileAudio, AlertCircle } from 'lucide-react'

interface AudioUploaderProps {
  onFileSelect: (file: File, duration: number) => void
  minDuration?: number
  maxDuration?: number
  maxFileSize?: number
}

const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-m4a', 'audio/m4a', 'audio/webm']
const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.webm']

export default function AudioUploader({
  onFileSelect,
  minDuration = 10,
  maxDuration = 300,
  maxFileSize = 50 * 1024 * 1024 // 50MB
}: AudioUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [audioDuration, setAudioDuration] = useState<number>(0)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const validateAudioFile = useCallback(async (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      const url = URL.createObjectURL(file)

      audio.addEventListener('loadedmetadata', () => {
        const duration = Math.floor(audio.duration)
        URL.revokeObjectURL(url)
        
        if (duration < minDuration) {
          reject(new Error(`Audio must be at least ${minDuration} seconds long`))
        } else if (duration > maxDuration) {
          reject(new Error(`Audio cannot exceed ${maxDuration / 60} minutes`))
        } else {
          resolve(duration)
        }
      })

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load audio file'))
      })

      audio.src = url
    })
  }, [minDuration, maxDuration])

  const handleFileSelection = useCallback(async (file: File) => {
    setError(null)
    setIsValidating(true)

    try {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          throw new Error('Please upload an MP3, WAV, M4A, or WebM file')
        }
      }

      // Validate file size
      if (file.size > maxFileSize) {
        throw new Error(`File size must not exceed ${maxFileSize / 1024 / 1024}MB`)
      }

      // Validate audio duration
      const duration = await validateAudioFile(file)
      setAudioDuration(duration)
      setSelectedFile(file)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process audio file')
      setSelectedFile(null)
    } finally {
      setIsValidating(false)
    }
  }, [maxFileSize, validateAudioFile])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    const audioFile = files.find(file => 
      ALLOWED_TYPES.includes(file.type) || 
      ALLOWED_EXTENSIONS.includes(file.name.substring(file.name.lastIndexOf('.')).toLowerCase())
    )

    if (audioFile) {
      handleFileSelection(audioFile)
    } else {
      setError('Please drop an audio file (MP3, WAV, M4A, or WebM)')
    }
  }, [handleFileSelection])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelection(file)
    }
  }, [handleFileSelection])

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleConfirm = useCallback(() => {
    if (selectedFile && audioDuration) {
      onFileSelect(selectedFile, audioDuration)
    }
  }, [selectedFile, audioDuration, onFileSelect])

  const handleCancel = useCallback(() => {
    setSelectedFile(null)
    setError(null)
    setAudioDuration(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleUploadClick}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${isDragActive 
              ? 'border-sage-primary bg-sage-light/20' 
              : 'border-border-primary hover:border-sage-primary hover:bg-background-secondary'
            }
            ${error ? 'border-error-primary' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_EXTENSIONS.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-sage-primary" />
              </div>
            </div>

            <div>
              <p className="text-heading-sm font-medium text-text-primary mb-1">
                {isDragActive ? 'Drop your audio file here' : 'Upload an audio file'}
              </p>
              <p className="text-body-sm text-text-secondary">
                Drag & drop or click to browse
              </p>
              <p className="text-body-xs text-text-tertiary mt-2">
                MP3, WAV, M4A, or WebM • {minDuration}s–{maxDuration / 60}min • Max {maxFileSize / 1024 / 1024}MB
              </p>
            </div>
          </div>

          {isValidating && (
            <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sage-primary"></div>
                <p className="mt-2 text-body-sm text-text-secondary">Validating audio file...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-background-secondary rounded-lg p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-sage-light rounded-full flex items-center justify-center">
                <FileAudio className="w-6 h-6 text-sage-primary" />
              </div>
              <div>
                <p className="text-heading-sm font-medium text-text-primary">
                  {selectedFile.name}
                </p>
                <p className="text-body-sm text-text-secondary">
                  {formatFileSize(selectedFile.size)} • {formatDuration(audioDuration)}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-background-primary rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-border-primary rounded-lg text-text-primary hover:bg-background-primary transition-colors"
            >
              Choose Different File
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-sage-primary text-white rounded-lg hover:bg-sage-deep transition-colors"
            >
              Use This File
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-error-light/10 border border-error-light rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-error-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-body-sm text-error-primary font-medium">
              Unable to use this file
            </p>
            <p className="text-body-sm text-error-primary mt-1">
              {error}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}