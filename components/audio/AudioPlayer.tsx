'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Download } from 'lucide-react'

interface AudioPlayerProps {
  src: string
  title?: string
  className?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  showDownload?: boolean
  downloadUrl?: string
  downloadFilename?: string
}

export default function AudioPlayer({
  src,
  title,
  className = '',
  onPlay,
  onPause,
  onEnded,
  showDownload = false,
  downloadUrl,
  downloadFilename = 'memory.mp3'
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      onEnded?.()
    }

    const handleError = () => {
      setError('Failed to load audio')
      setIsLoading(false)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [onEnded])

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      onPause?.()
    } else {
      audio.play()
      setIsPlaying(true)
      onPlay?.()
    }
  }, [isPlaying, onPlay, onPause])

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    const progress = progressRef.current
    if (!audio || !progress) return

    const rect = progress.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * duration

    audio.currentTime = newTime
    setCurrentTime(newTime)
  }, [duration])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }, [isMuted, volume])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    audio.volume = newVolume
    setIsMuted(newVolume === 0)
  }, [])

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  if (error) {
    return (
      <div className={`bg-error-light/10 border border-error-light rounded-lg p-4 ${className}`}>
        <p className="text-body-sm text-error-primary">{error}</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-border-primary p-4 ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {title && (
        <div className="mb-3">
          <h3 className="text-body-md font-medium text-text-primary truncate">{title}</h3>
        </div>
      )}

      <div className="space-y-3">
        {/* Progress Bar */}
        <div 
          ref={progressRef}
          onClick={handleProgressClick}
          className="relative h-2 bg-background-secondary rounded-full cursor-pointer group"
        >
          <div 
            className="absolute h-full bg-sage-primary rounded-full transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          />
          <div 
            className="absolute w-4 h-4 bg-sage-primary rounded-full -top-1 transition-all duration-100 opacity-0 group-hover:opacity-100"
            style={{ left: `calc(${progressPercentage}% - 8px)` }}
          />
        </div>

        {/* Time Display */}
        <div className="flex justify-between text-body-xs text-text-secondary">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              disabled={isLoading}
              className="w-10 h-10 bg-sage-primary text-white rounded-full flex items-center justify-center hover:bg-sage-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            {/* Volume Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="p-1.5 hover:bg-background-secondary rounded-full transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-text-secondary" />
                ) : (
                  <Volume2 className="w-4 h-4 text-text-secondary" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-background-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-sage-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>

          {/* Download Button */}
          {showDownload && downloadUrl && (
            <a
              href={downloadUrl}
              download={downloadFilename}
              className="p-1.5 hover:bg-background-secondary rounded-full transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4 text-text-secondary" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}