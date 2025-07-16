'use client'

import { useState } from 'react'
import { Mic, MoreVertical, Check, AlertCircle, Loader2, Trash2, Edit, Flower2, Sprout, TreePine, Sparkles, Droplets } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import OrganicCard, { CardContent, CardFooter } from '@/components/ui/OrganicCard'
import Card from '@/components/ui/Card'

interface VoiceProfile {
  id: string
  name: string
  description?: string
  model_type: string
  minimax_voice_id: string
  training_status: 'pending' | 'processing' | 'completed' | 'failed'
  is_active: boolean
  created_at: string
  training_completed_at?: string
  error_message?: string
}

interface VoiceProfileCardProps {
  profile: VoiceProfile
  onEdit?: (profile: VoiceProfile) => void
  onDelete?: (profile: VoiceProfile) => void
  onTrain?: (profile: VoiceProfile) => void
  onToggleActive?: (profile: VoiceProfile) => void
}

export default function VoiceProfileCard({
  profile,
  onEdit,
  onDelete,
  onTrain,
  onToggleActive
}: VoiceProfileCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  
  const getStatusIcon = () => {
    switch (profile.training_status) {
      case 'completed':
        return <Flower2 className="w-6 h-6 text-sage-primary" />
      case 'processing':
        return <Sprout className="w-5 h-5 text-warm-primary animate-pulse" />
      case 'failed':
        return <Droplets className="w-5 h-5 text-error-primary" />
      default:
        return <TreePine className="w-5 h-5 text-text-light" />
    }
  }
  
  const getStatusText = () => {
    switch (profile.training_status) {
      case 'completed':
        return 'Bloomed & Ready'
      case 'processing':
        return 'Growing...'
      case 'failed':
        return 'Needs nurturing'
      default:
        return 'Waiting to grow'
    }
  }
  
  const getStatusColor = () => {
    switch (profile.training_status) {
      case 'completed':
        return 'text-sage-primary'
      case 'processing':
        return 'text-warm-primary'
      case 'failed':
        return 'text-error-primary'
      default:
        return 'text-text-light'
    }
  }
  
  const getCardColorScheme = () => {
    switch (profile.training_status) {
      case 'completed':
        return 'sage'
      case 'processing':
        return 'dawn'
      case 'failed':
        return 'earth'
      default:
        return 'default'
    }
  }

  return (
    <OrganicCard 
      className={`p-6 transition-all duration-500 hover:shadow-elevated overflow-visible ${!profile.is_active ? 'opacity-60' : ''} ${
        profile.training_status === 'processing' ? 'animate-pulse' : ''
      }`}
      colorScheme={getCardColorScheme()}
      withBlob={profile.training_status === 'completed'}
      animate="scale-in"
      variant="elevated"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-organic flex items-center justify-center transition-all ${
            profile.training_status === 'completed' ? 'bg-gradient-to-br from-sage-light to-sage-mist shadow-soft' :
            profile.training_status === 'processing' ? 'bg-gradient-to-br from-warm-sand to-accent-dawn' :
            profile.training_status === 'failed' ? 'bg-gradient-to-br from-error-light/30 to-warm-sand' :
            'bg-gradient-to-br from-warm-sand/50 to-sage-mist/30'
          }`}>
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-h4 text-sage-deep">
              {profile.name}
            </h3>
            <p className={`text-body-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-warm-sand/20 rounded-lg transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-text-secondary" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-soft py-2 z-10">
              {profile.training_status === 'pending' && onTrain && (
                <button
                  onClick={() => {
                    onTrain(profile)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-body-sm text-text-secondary hover:bg-sage-mist/20 hover:text-sage-primary transition-colors flex items-center space-x-2"
                >
                  <Sprout className="w-4 h-4" />
                  <span>Nurture Voice</span>
                </button>
              )}
              
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(profile)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-body-sm text-text-secondary hover:bg-warm-sand/20 hover:text-sage-primary transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
              
              {onToggleActive && (
                <button
                  onClick={() => {
                    onToggleActive(profile)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-body-sm text-text-secondary hover:bg-sage-mist/20 hover:text-sage-primary transition-colors rounded-organic"
                >
                  {profile.is_active ? 'Deactivate' : 'Activate'}
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(profile)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-body-sm text-error-primary hover:bg-error-light/20 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {profile.description && (
        <p className="text-text-secondary text-body-sm mb-4">
          {profile.description}
        </p>
      )}
      
      {profile.error_message && (
        <div className="bg-error-light/20 rounded-lg p-3 mb-4">
          <p className="text-error-primary text-body-sm">
            {profile.error_message}
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-caption text-text-light">
        <span className="flex items-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span>{profile.model_type === 'speech-02-hd' ? 'Crystal Clear' : 'Swift Growth'}</span>
        </span>
        <span>
          {profile.training_completed_at 
            ? `Bloomed ${formatDistanceToNow(new Date(profile.training_completed_at))} ago`
            : `Planted ${formatDistanceToNow(new Date(profile.created_at))} ago`
          }
        </span>
      </div>
      
      {profile.training_status === 'completed' && !profile.is_active && (
        <div className="mt-4 bg-gradient-to-r from-warm-sand/30 to-sage-mist/20 rounded-organic p-4">
          <p className="text-warm-deep text-body-sm font-medium text-center">
            This voice rests in peaceful slumber
          </p>
        </div>
      )}
      
      {profile.training_status === 'completed' && profile.is_active && (
        <div className="mt-4">
          <a
            href={`/memories/voice-synthesis?voice=${profile.id}`}
            className="btn-primary w-full text-center flex items-center justify-center space-x-2 group"
          >
            <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Speak With This Voice</span>
          </a>
        </div>
      )}
    </OrganicCard>
  )
}