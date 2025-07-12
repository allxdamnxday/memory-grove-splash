'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Trash2, Calendar, Clock, FileAudio, Zap } from 'lucide-react'
import AudioPlayer from './AudioPlayer'
import { MemoryOrganicCard, CardContent } from '@/components/ui/OrganicCard'
import Card from '@/components/ui/Card'

interface Memory {
  id: string
  title: string
  description?: string
  duration: number
  file_size: number
  created_at: string
  signedUrl?: string
  is_cloned?: boolean
  source_text?: string
}

interface MemoryCardProps {
  memory: Memory
  onDelete: (id: string) => Promise<void>
}

export default function MemoryCard({ memory, onDelete }: MemoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(memory.id)
    } catch (error) {
      console.error('Failed to delete memory:', error)
      setIsDeleting(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  return (
    <>
      <MemoryOrganicCard 
        className="hover:shadow-soft transition-all duration-300"
      >
        <CardContent>
          <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-heading-sm font-medium text-text-primary">
                {memory.title}
              </h3>
              {memory.is_cloned && (
                <div className="flex items-center px-2 py-0.5 bg-sage-light/30 rounded-full">
                  <Zap className="w-3 h-3 text-sage-primary mr-1" />
                  <span className="text-body-xs text-sage-deep font-medium">AI Generated</span>
                </div>
              )}
            </div>
            {memory.description && (
              <p className="text-body-sm text-text-secondary line-clamp-2">
                {memory.description}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowConfirmDelete(true)}
            disabled={isDeleting}
            className="ml-4 p-2 hover:bg-sage-mist/30 rounded-full transition-colors text-text-secondary hover:text-accent-earth disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-4 text-body-xs text-text-tertiary mb-4">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(memory.duration)}
          </span>
          <span className="flex items-center">
            <FileAudio className="w-3 h-3 mr-1" />
            {formatFileSize(memory.file_size)}
          </span>
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDistanceToNow(new Date(memory.created_at), { addSuffix: true })}
          </span>
        </div>

        {memory.signedUrl && (
          <AudioPlayer
            src={memory.signedUrl}
            showDownload
            downloadUrl={memory.signedUrl}
            downloadFilename={`${memory.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.mp3`}
          />
        )}
        </CardContent>
      </MemoryOrganicCard>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card 
            shape="organic" 
            variant="elevated" 
            className="max-w-md w-full"
          >
            <h3 className="text-heading-sm font-medium mb-2">Delete Memory?</h3>
            <p className="text-body-sm text-text-secondary mb-6">
              This will permanently remove &quot;{memory.title}&quot; from your grove. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-border-primary rounded-lg text-text-primary hover:bg-background-secondary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-error-primary text-white rounded-lg hover:bg-error-deep transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}