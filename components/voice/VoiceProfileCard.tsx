'use client'

import { useState } from 'react'
import { Mic, MoreVertical, Check, AlertCircle, Loader2, Trash2, Edit } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

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
        return <Check className="w-5 h-5 text-sage-primary" />
      case 'processing':
        return <Loader2 className="w-5 h-5 text-warm-primary animate-spin" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-error-primary" />
      default:
        return <Mic className="w-5 h-5 text-text-light" />
    }
  }
  
  const getStatusText = () => {
    switch (profile.training_status) {
      case 'completed':
        return 'Ready to use'
      case 'processing':
        return 'Training in progress...'
      case 'failed':
        return 'Training failed'
      default:
        return 'Not trained'
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
  
  return (
    <div className={`bg-white rounded-lg shadow-soft p-6 ${!profile.is_active ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-sage-mist flex items-center justify-center">
            {getStatusIcon()}
          </div>
          <div>
            <h3 className="font-serif text-h4 text-sage-deep">
              {profile.name}
            </h3>
            <p className={`text-body-sm ${getStatusColor()}`}>
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
                  className="w-full text-left px-4 py-2 text-body-sm text-text-secondary hover:bg-warm-sand/20 hover:text-sage-primary transition-colors"
                >
                  Train Voice
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
                  className="w-full text-left px-4 py-2 text-body-sm text-text-secondary hover:bg-warm-sand/20 hover:text-sage-primary transition-colors"
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
        <span>Model: {profile.model_type === 'speech-02-hd' ? 'HD Quality' : 'Turbo'}</span>
        <span>
          {profile.training_completed_at 
            ? `Trained ${formatDistanceToNow(new Date(profile.training_completed_at))} ago`
            : `Created ${formatDistanceToNow(new Date(profile.created_at))} ago`
          }
        </span>
      </div>
      
      {profile.training_status === 'completed' && !profile.is_active && (
        <div className="mt-4 bg-warm-sand/20 rounded-lg p-3">
          <p className="text-warm-primary text-body-sm">
            This voice profile is deactivated
          </p>
        </div>
      )}
    </div>
  )
}