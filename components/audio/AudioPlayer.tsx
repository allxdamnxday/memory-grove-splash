'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Download } from 'lucide-react'
import Button from '@/components/ui/Button'

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
  compact?: boolean
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
  downloadFilename = 'memory.mp3',
  compact = false
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
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00'
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
    <div className={`bg-gradient-to-br from-warm-white to-sage-mist/20 rounded-2xl shadow-inner border border-sage-light/30 ${compact ? 'p-5' : 'p-6'} ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {title && (
        <div className={compact ? 'mb-2' : 'mb-3'}>
          <h3 className="text-body-md font-medium text-text-primary truncate">{title}</h3>
        </div>
      )}

      <div className={compact ? 'space-y-3' : 'space-y-4'}>
        {/* Progress Bar */}
        <div 
          ref={progressRef}
          onClick={handleProgressClick}
          className="relative h-3 bg-warm-sand/60 rounded-full cursor-pointer group py-4 -my-4 overflow-hidden"
        >
          <div 
            className="absolute h-full bg-gradient-to-r from-sage-primary to-sage-light rounded-full transition-all duration-100 shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          />
          <div 
            className="absolute w-5 h-5 bg-sage-primary rounded-full -top-1 transition-all duration-100 shadow-soft border-2 border-warm-white"
            style={{ left: `calc(${progressPercentage}% - 10px)` }}
          />
        </div>

        {/* Time Display */}
        <div className="flex justify-between text-body-sm text-text-secondary px-1">
          <span className="min-w-0 font-medium text-sage-deep">{formatTime(currentTime)}</span>
          <span className="min-w-0 text-right font-medium text-sage-deep">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${compact ? 'space-x-3' : 'space-x-4'}`}>
            {/* Play/Pause Button */}
            <Button
              onClick={togglePlayPause}
              variant="primary"
              size="icon-lg"
              loading={isLoading}
              icon={isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              className="!rounded-full !bg-sage-primary hover:!bg-sage-deep !shadow-soft !w-14 !h-14"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            />

            {/* Volume Controls - Hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-3">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="icon-sm"
                icon={isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                className="!p-2 hover:!bg-sage-light/20 !rounded-full"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-2 bg-warm-sand/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-sage-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm"
              />
            </div>
          </div>

          {/* Download Button */}
          {showDownload && downloadUrl && (
            <a
              href={downloadUrl}
              download={downloadFilename}
              className="min-w-touch min-h-touch sm:min-w-0 sm:min-h-0 sm:p-3 flex items-center justify-center bg-sage-light/20 hover:bg-sage-light/30 rounded-full transition-all transform active:scale-95 shadow-sm"
              title="Download memory"
            >
              <Download className="w-5 h-5 text-sage-primary" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}