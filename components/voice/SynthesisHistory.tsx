'use client'

import { useState, useEffect } from 'react'
import { Search, Trash2, Download, Calendar, Volume2, Filter, RefreshCw, Eye } from 'lucide-react'
import AudioPlayer from '@/components/audio/AudioPlayer'

interface VoiceProfile {
  id: string
  name: string
  minimax_voice_id: string
}

interface SynthesisEntry {
  id: string
  text: string
  textPreview: string
  emotion: string
  audio_url: string
  duration: number
  file_size: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  completed_at: string | null
  voice_profile: VoiceProfile
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface SynthesisHistoryProps {
  voiceProfiles?: VoiceProfile[]
  className?: string
}

export default function SynthesisHistory({ voiceProfiles = [], className = '' }: SynthesisHistoryProps) {
  const [syntheses, setSyntheses] = useState<SynthesisEntry[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [searchText, setSearchText] = useState('')
  const [selectedVoiceProfile, setSelectedVoiceProfile] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // UI state
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch synthesis history
  const fetchHistory = async (page: number = 1) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      })
      
      if (searchText.trim()) {
        params.append('search', searchText.trim())
      }
      
      if (selectedVoiceProfile) {
        params.append('voice_profile_id', selectedVoiceProfile)
      }
      
      const response = await fetch(`/api/voice/synthesize/history?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch synthesis history')
      }
      
      setSyntheses(data.syntheses)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load synthesis history')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete synthesis entry
  const deleteSynthesis = async (id: string) => {
    setDeletingId(id)
    
    try {
      const response = await fetch(`/api/voice/synthesize/history?id=${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete synthesis')
      }
      
      // Remove from list
      setSyntheses(prev => prev.filter(s => s.id !== id))
      
      // Update pagination total
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1
      }))
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete synthesis')
    } finally {
      setDeletingId(null)
    }
  }

  // Download audio file
  const downloadAudio = (synthesis: SynthesisEntry) => {
    const link = document.createElement('a')
    link.href = synthesis.audio_url
    link.download = `synthesis_${synthesis.voice_profile.name}_${new Date(synthesis.created_at).toISOString().split('T')[0]}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Load initial data
  useEffect(() => {
    fetchHistory()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Search/filter handler
  const handleSearch = () => {
    fetchHistory(1)
  }

  // Reset filters
  const resetFilters = () => {
    setSearchText('')
    setSelectedVoiceProfile('')
    fetchHistory(1)
  }

  // Pagination handlers
  const goToPage = (page: number) => {
    fetchHistory(page)
  }

  if (isLoading && syntheses.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-sage-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header & Filters */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-h3 text-sage-deep">Synthesis History</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="space-y-4 p-4 bg-sage-mist/20 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-sm font-medium text-text-primary mb-2">
                  Search Text
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-light" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search synthesis text..."
                    className="input-field pl-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-body-sm font-medium text-text-primary mb-2">
                  Voice Profile
                </label>
                <select
                  value={selectedVoiceProfile}
                  onChange={(e) => setSelectedVoiceProfile(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Profiles</option>
                  {voiceProfiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button onClick={handleSearch} className="btn-primary">
                Apply Filters
              </button>
              <button onClick={resetFilters} className="btn-secondary">
                Reset
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-error-light/20 rounded-lg p-4 text-error-primary text-body-sm">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {syntheses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-soft p-8 text-center">
          <Volume2 className="w-16 h-16 text-text-light mx-auto mb-4" />
          <h3 className="font-serif text-h4 text-sage-deep mb-2">No Synthesis History</h3>
          <p className="text-text-secondary">
            Your generated speech will appear here once you start creating voice memories.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {syntheses.map(synthesis => (
            <div key={synthesis.id} className="bg-white rounded-lg shadow-soft overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-text-primary">
                        {synthesis.voice_profile.name}
                      </h3>
                      <span className="text-body-sm text-text-secondary">
                        {synthesis.emotion}
                      </span>
                      <span className={`px-2 py-1 rounded text-caption font-medium ${
                        synthesis.status === 'completed' ? 'bg-sage-mist text-sage-deep' :
                        synthesis.status === 'failed' ? 'bg-error-light text-error-primary' :
                        'bg-warm-sand text-text-secondary'
                      }`}>
                        {synthesis.status}
                      </span>
                    </div>
                    
                    <p className="text-text-secondary text-body-sm mb-3">
                      {synthesis.textPreview}
                      {synthesis.textPreview !== synthesis.text && (
                        <button
                          onClick={() => setExpandedEntry(
                            expandedEntry === synthesis.id ? null : synthesis.id
                          )}
                          className="ml-2 text-sage-primary hover:text-sage-deep"
                        >
                          <Eye className="w-4 h-4 inline" />
                        </button>
                      )}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-caption text-text-light">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(synthesis.created_at)}</span>
                      </span>
                      {synthesis.duration > 0 && (
                        <span>{formatDuration(synthesis.duration)}</span>
                      )}
                      {synthesis.file_size > 0 && (
                        <span>{formatFileSize(synthesis.file_size)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {synthesis.status === 'completed' && synthesis.audio_url && (
                      <button
                        onClick={() => downloadAudio(synthesis)}
                        className="p-2 text-text-secondary hover:text-sage-primary rounded-lg hover:bg-sage-mist/20 transition-colors"
                        title="Download audio"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteSynthesis(synthesis.id)}
                      disabled={deletingId === synthesis.id}
                      className="p-2 text-text-secondary hover:text-error-primary rounded-lg hover:bg-error-light/20 transition-colors disabled:opacity-50"
                      title="Delete synthesis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded text */}
                {expandedEntry === synthesis.id && (
                  <div className="mt-4 p-4 bg-sage-mist/20 rounded-lg">
                    <p className="text-text-primary text-body-sm whitespace-pre-wrap">
                      {synthesis.text}
                    </p>
                  </div>
                )}

                {/* Audio player */}
                {synthesis.status === 'completed' && synthesis.audio_url && (
                  <div className="mt-4 border-t border-warm-pebble/20 pt-4">
                    <AudioPlayer
                      src={synthesis.audio_url}
                      title={`${synthesis.voice_profile.name} - ${synthesis.textPreview}`}
                      showDownload={true}
                      downloadUrl={synthesis.audio_url}
                      downloadFilename={`synthesis_${synthesis.voice_profile.name}_${new Date(synthesis.created_at).toISOString().split('T')[0]}.mp3`}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div className="text-body-sm text-text-secondary">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === pagination.totalPages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  )
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-text-light">...</span>
                      )}
                      <button
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 rounded text-body-sm ${
                          page === pagination.page
                            ? 'bg-sage-primary text-white'
                            : 'text-text-secondary hover:bg-sage-mist/20'
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  ))
                }
              </div>
              
              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}