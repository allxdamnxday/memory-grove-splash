'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, FileAudio, Sparkles } from 'lucide-react'
import Link from 'next/link'
import SwipeableMemoryCard from './SwipeableMemoryCard'

interface Memory {
  id: string
  title: string
  description?: string
  duration: number
  file_size: number
  created_at: string
  signedUrl?: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function MemoriesList() {
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchMemories(currentPage)
  }, [currentPage])

  const fetchMemories = async (page: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/memories?page=${page}&limit=9`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch memories')
      }

      const data = await response.json()
      setMemories(data.memories)
      setPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching memories:', err)
      setError('Unable to load your memories. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/memories?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete memory')
      }

      // Remove from local state
      setMemories(prev => prev.filter(m => m.id !== id))
      
      // Update pagination count
      if (pagination) {
        setPagination({
          ...pagination,
          total: pagination.total - 1,
          totalPages: Math.ceil((pagination.total - 1) / pagination.limit)
        })
      }

      // If we deleted the last item on a page (except first page), go back one page
      if (memories.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1)
      }

      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-sage-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-error-light/10 border border-error-light rounded-lg p-6 text-center">
        <p className="text-body-md text-error-primary">{error}</p>
        <button
          onClick={() => fetchMemories(currentPage)}
          className="mt-4 px-4 py-2 bg-error-primary text-white rounded-lg hover:bg-error-deep transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (memories.length === 0) {
    return (
      <div className="bg-background-secondary rounded-lg p-12 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-24 h-24 bg-sage-light rounded-full flex items-center justify-center mx-auto">
            <FileAudio className="w-12 h-12 text-sage-primary" />
          </div>
          <div>
            <h3 className="text-heading-md font-serif mb-2">Your grove awaits</h3>
            <p className="text-body-md text-text-secondary">
              Begin preserving your voice and stories. Each memory becomes a lasting part of your digital sanctuary.
            </p>
          </div>
          <Link
            href="/account/memories/new"
            className="inline-flex items-center px-6 py-3 bg-sage-primary text-white rounded-full hover:bg-sage-deep transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Memory
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-mobile-heading sm:text-heading-lg font-serif">Your Memories</h2>
          <p className="text-mobile-sm sm:text-body-md text-text-secondary mt-1">
            {pagination?.total || 0} {pagination?.total === 1 ? 'memory' : 'memories'} preserved
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/memories/voice-synthesis"
            className="inline-flex items-center justify-center min-h-touch px-4 py-2 bg-warm-primary text-white rounded-lg hover:bg-warm-deep transition-all transform active:scale-95 text-mobile-sm sm:text-body-sm flex-1 sm:flex-initial"
          >
            <Sparkles className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
            <span className="hidden sm:inline">Create with AI</span>
            <span className="sm:hidden">AI Create</span>
          </Link>
          <Link
            href="/account/memories/new"
            className="inline-flex items-center justify-center min-h-touch px-4 py-2 bg-sage-primary text-white rounded-lg hover:bg-sage-deep transition-all transform active:scale-95 text-mobile-sm sm:text-body-sm flex-1 sm:flex-initial"
          >
            <Plus className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
            <span className="hidden sm:inline">Record New</span>
            <span className="sm:hidden">Record</span>
          </Link>
        </div>
      </div>

      {/* Memories Grid - Single column on mobile */}
      <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {memories.map((memory) => (
          <SwipeableMemoryCard
            key={memory.id}
            memory={memory}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2 pt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="min-h-touch px-4 py-2 border border-border-primary rounded-lg hover:bg-background-secondary transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-mobile-sm sm:text-body-sm"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(page => {
                const distance = Math.abs(page - currentPage)
                return distance === 0 || distance === 1 || page === 1 || page === pagination.totalPages
              })
              .map((page, index, array) => (
                <div key={page} className="flex items-center">
                  {index > 0 && array[index - 1] < page - 1 && (
                    <span className="px-2 text-text-tertiary">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-touch min-h-touch sm:w-10 sm:h-10 rounded-lg transition-all transform active:scale-95 text-mobile-sm sm:text-body-sm ${
                      page === currentPage
                        ? 'bg-sage-primary text-white'
                        : 'hover:bg-background-secondary'
                    }`}
                  >
                    {page}
                  </button>
                </div>
              ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages}
            className="min-h-touch px-4 py-2 border border-border-primary rounded-lg hover:bg-background-secondary transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-mobile-sm sm:text-body-sm"
          >
            Next
          </button>
        </div>
      )}
      
      {/* Floating Action Button - Mobile only */}
      <Link
        href="/account/memories/new"
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-sage-primary text-white rounded-full shadow-xl flex items-center justify-center hover:bg-sage-deep transition-all transform active:scale-95 z-10"
        aria-label="Create new memory"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  )
}