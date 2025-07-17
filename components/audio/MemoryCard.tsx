'use client'

import { useState, useEffect, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Trash2, Calendar, Clock, FileAudio, Sparkles, MoreVertical, Download, Share2, Edit } from 'lucide-react'
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
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

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
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes: number) => {
    if (isNaN(bytes) || !isFinite(bytes) || bytes < 0) return '0 KB'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  return (
    <>
      <div className="relative bg-warm-white border border-warm-sand rounded-2xl shadow-sm hover:shadow-soft transition-all duration-300 group overflow-hidden">
        {/* AI Badge positioned absolutely */}
        {memory.is_cloned && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center px-2.5 py-1 bg-sage-mist/80 backdrop-blur-sm rounded-full">
              <Sparkles className="w-3 h-3 text-sage-primary mr-1" />
              <span className="text-caption text-sage-deep font-medium">AI Generated</span>
            </div>
          </div>
        )}
        
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-heading-sm font-serif text-sage-deep leading-tight mb-2">
              {memory.title}
            </h3>
            {memory.description && memory.description !== memory.title && (
              <p className="text-body-sm text-text-secondary line-clamp-2 leading-relaxed">
                {memory.description}
              </p>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-sage-light/20 rounded-full transition-all text-text-tertiary hover:text-sage-deep"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div ref={menuRef} className="absolute right-0 top-full mt-2 w-48 bg-warm-white rounded-lg shadow-elevated border border-warm-sand z-50">
                <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-sage-mist/30 transition-colors text-text-primary">
                  <Edit className="w-4 h-4 text-sage-primary" />
                  <span className="text-body-sm">Edit Memory</span>
                </button>
                <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-sage-mist/30 transition-colors text-text-primary">
                  <Share2 className="w-4 h-4 text-sage-primary" />
                  <span className="text-body-sm">Share</span>
                </button>
                <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-sage-mist/30 transition-colors text-text-primary">
                  <Download className="w-4 h-4 text-sage-primary" />
                  <span className="text-body-sm">Download</span>
                </button>
                <div className="border-t border-warm-stone" />
                <button 
                  onClick={() => {
                    setShowMenu(false)
                    setShowConfirmDelete(true)
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-error-light/20 transition-colors text-error-primary"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-body-sm">Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4 text-caption text-text-tertiary">
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-text-tertiary opacity-60" />
            <span>{formatDuration(memory.duration)}</span>
          </span>
          <span className="flex items-center">
            <FileAudio className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-text-tertiary opacity-60" />
            <span>{formatFileSize(memory.file_size)}</span>
          </span>
          <span className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-text-tertiary opacity-60" />
            <span>Planted {formatDistanceToNow(new Date(memory.created_at), { addSuffix: true })}</span>
          </span>
        </div>

        {memory.signedUrl && (
          <div className="">
            <AudioPlayer
              src={memory.signedUrl}
              showDownload
              downloadUrl={memory.signedUrl}
              downloadFilename={`${memory.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.mp3`}
              compact
              className="border-0"
            />
          </div>
        )}
        </div>
      </div>

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