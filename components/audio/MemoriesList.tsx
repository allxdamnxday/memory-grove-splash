'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, FileAudio, Sparkles, SlidersHorizontal, ChevronDown, TreePine } from 'lucide-react'
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

type FilterType = 'all' | 'voice' | 'ai'
type SortType = 'newest' | 'oldest' | 'name' | 'longest'

export default function MemoriesList() {
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('newest')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const sortDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false)
      }
    }

    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSortDropdown])

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
      <div className="relative">
        {/* Beautiful Empty State */}
        <div className="bg-gradient-to-br from-sage-mist/30 via-warm-white to-warm-sand/20 rounded-3xl p-16 text-center overflow-hidden relative">
          {/* Decorative background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-sage-light/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-warm-primary/10 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-lg mx-auto space-y-8 relative z-10">
            {/* Grove Icon */}
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-sage-light/30 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-sage-mist rounded-full flex items-center justify-center">
                <TreePine className="w-16 h-16 text-sage-primary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-h2 font-serif text-sage-deep">Your Sacred Grove Awaits</h3>
              <p className="text-body-lg text-text-secondary leading-relaxed">
                Plant your first memory seed and watch it grow into something eternal. 
                Your voice carries the power to comfort, inspire, and connect across time.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/account/memories/new"
                className="inline-flex items-center px-8 py-4 bg-sage-primary hover:bg-sage-deep text-white rounded-full shadow-soft hover:shadow-elevated transition-all transform hover:scale-105 text-body-md font-medium"
              >
                <Plus className="w-5 h-5 mr-2.5" />
                Plant Your First Memory
              </Link>
              <Link
                href="/memories/voice-synthesis"
                className="inline-flex items-center px-8 py-4 bg-warm-white hover:bg-sage-mist border-2 border-sage-light text-sage-deep rounded-full shadow-sm hover:shadow-soft transition-all transform hover:scale-105 text-body-md font-medium"
              >
                <Sparkles className="w-5 h-5 mr-2.5" />
                Create with AI Magic
              </Link>
            </div>
            
            <p className="text-body-sm text-text-tertiary italic mt-8">
              &ldquo;Every journey begins with a single step into the grove&rdquo;
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      {/* Subtle decorative background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sage-light rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-warm-primary rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 relative">
        <div>
          <h2 className="text-mobile-heading sm:text-heading-lg font-serif text-sage-deep">Memory Garden</h2>
          <p className="text-mobile-sm sm:text-body-md text-text-secondary mt-1 italic">
            {pagination?.total || 0} {pagination?.total === 1 ? 'memory blooming' : 'memories blooming'} in your garden
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/account/memories/new"
            className="inline-flex items-center justify-center min-h-touch px-6 sm:px-8 py-3 bg-sage-primary hover:bg-sage-deep text-white rounded-full shadow-soft hover:shadow-elevated transition-all transform hover:scale-105 active:scale-95 text-body-sm flex-1 sm:flex-initial"
          >
            <Plus className="w-5 h-5 mr-2.5" />
            <span className="font-medium">Record New Memory</span>
          </Link>
          <Link
            href="/memories/voice-synthesis"
            className="inline-flex items-center justify-center min-h-touch px-6 sm:px-8 py-3 bg-warm-white hover:bg-sage-mist border-2 border-sage-light text-sage-deep rounded-full shadow-sm hover:shadow-soft transition-all transform hover:scale-105 active:scale-95 text-body-sm flex-1 sm:flex-initial"
          >
            <Sparkles className="w-5 h-5 mr-2.5" />
            <span className="font-medium">Create with AI</span>
          </Link>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-sage-mist/20 rounded-2xl p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-body-sm font-medium transition-all ${
              filter === 'all' 
                ? 'bg-sage-primary text-white shadow-sm' 
                : 'bg-warm-white text-sage-deep hover:bg-sage-light/20'
            }`}
          >
            All Memories
          </button>
          <button
            onClick={() => setFilter('voice')}
            className={`px-4 py-2 rounded-full text-body-sm font-medium transition-all ${
              filter === 'voice' 
                ? 'bg-sage-primary text-white shadow-sm' 
                : 'bg-warm-white text-sage-deep hover:bg-sage-light/20'
            }`}
          >
            Voice Only
          </button>
          <button
            onClick={() => setFilter('ai')}
            className={`px-4 py-2 rounded-full text-body-sm font-medium transition-all ${
              filter === 'ai' 
                ? 'bg-sage-primary text-white shadow-sm' 
                : 'bg-warm-white text-sage-deep hover:bg-sage-light/20'
            }`}
          >
            AI Enhanced
          </button>
        </div>
        
        <div className="relative" ref={sortDropdownRef}>
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-warm-white rounded-full text-body-sm font-medium text-sage-deep hover:bg-sage-light/20 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Sort by: {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : sortBy === 'name' ? 'Name' : 'Longest'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-warm-white rounded-xl shadow-elevated border border-warm-stone z-50">
              <button 
                onClick={() => { setSortBy('newest'); setShowSortDropdown(false); }}
                className="w-full px-4 py-3 flex items-center hover:bg-sage-mist/30 transition-colors text-text-primary text-body-sm"
              >
                Newest First
              </button>
              <button 
                onClick={() => { setSortBy('oldest'); setShowSortDropdown(false); }}
                className="w-full px-4 py-3 flex items-center hover:bg-sage-mist/30 transition-colors text-text-primary text-body-sm"
              >
                Oldest First
              </button>
              <button 
                onClick={() => { setSortBy('name'); setShowSortDropdown(false); }}
                className="w-full px-4 py-3 flex items-center hover:bg-sage-mist/30 transition-colors text-text-primary text-body-sm"
              >
                By Name
              </button>
              <button 
                onClick={() => { setSortBy('longest'); setShowSortDropdown(false); }}
                className="w-full px-4 py-3 flex items-center hover:bg-sage-mist/30 transition-colors text-text-primary text-body-sm"
              >
                Longest Duration
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Memories Grid - Single column on mobile */}
      <div className="grid gap-8 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 relative">
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
    </div>
  )
}