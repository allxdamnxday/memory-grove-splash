'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Mic, Square, Pause, Play, Upload, Loader2 } from 'lucide-react'
import { convertForVoicePreservation, isMiniMaxCompatible } from '@/lib/utils/audio-converter'

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void
  minDuration?: number
  maxDuration?: number
}

export default function AudioRecorder({ 
  onRecordingComplete, 
  minDuration = 10,
  maxDuration = 300 
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showEarlyStopWarning, setShowEarlyStopWarning] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionProgress, setConversionProgress] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/ogg'

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        setAudioBlob(audioBlob)
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= maxDuration) {
            stopRecording()
          }
          return newTime
        })
      }, 1000)

    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access your microphone. Please check your permissions.')
    }
  }, [maxDuration]) // eslint-disable-line react-hooks/exhaustive-deps

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      // Check if recording meets minimum duration
      if (recordingTime < minDuration) {
        setShowEarlyStopWarning(true)
        // Pause the recording while showing warning
        if (!isPaused && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.pause()
          setIsPaused(true)
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
        }
        return
      }

      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Clean up stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [isRecording, recordingTime, minDuration, isPaused])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording, isPaused])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= maxDuration) {
            stopRecording()
          }
          return newTime
        })
      }, 1000)
    }
  }, [isRecording, isPaused, maxDuration, stopRecording])

  const handleSave = useCallback(async () => {
    if (audioBlob && recordingTime >= minDuration) {
      // Check if conversion is needed
      if (!isMiniMaxCompatible(audioBlob.type)) {
        setIsConverting(true)
        setConversionProgress(0)
        
        try {
          // Convert to MP3 with voice-optimized settings
          const mp3Blob = await convertForVoicePreservation(
            audioBlob,
            'standard',
            (progress) => setConversionProgress(progress)
          )
          
          // Call the completion handler with the converted MP3
          onRecordingComplete(mp3Blob, recordingTime)
        } catch (error) {
          console.error('Audio conversion failed:', error)
          alert('Failed to convert audio. Please try recording again.')
        } finally {
          setIsConverting(false)
          setConversionProgress(0)
        }
      } else {
        // Audio is already in a compatible format
        onRecordingComplete(audioBlob, recordingTime)
      }
    }
  }, [audioBlob, recordingTime, minDuration, onRecordingComplete])

  const resetRecording = useCallback(() => {
    setAudioBlob(null)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl(null)
    setRecordingTime(0)
    setIsPlaying(false)
  }, [audioUrl])

  const handleContinueRecording = useCallback(() => {
    setShowEarlyStopWarning(false)
    // Resume recording if it was paused
    if (mediaRecorderRef.current && isPaused) {
      resumeRecording()
    }
  }, [isPaused, resumeRecording])

  const handleDiscardRecording = useCallback(() => {
    setShowEarlyStopWarning(false)
    // Force stop the recording
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Clean up stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
    // Reset everything
    setRecordingTime(0)
  }, [isRecording])

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [isPlaying])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border-primary p-6">
      <div className="space-y-6">
        {/* Recording Status */}
        <div className="text-center">
          <div className="text-heading-md font-serif mb-2">
            {isRecording ? (isPaused ? 'Recording Paused' : 'Recording...') : 
             audioBlob ? 'Recording Complete' : 'Ready to Record'}
          </div>
          <div className="text-heading-lg font-mono text-sage-primary">
            {formatTime(recordingTime)}
          </div>
          {isRecording && (
            <div className="mt-2 text-body-sm text-text-secondary">
              {maxDuration - recordingTime} seconds remaining
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center space-x-4">
          {!isRecording && !audioBlob && (
            <button
              onClick={startRecording}
              className="inline-flex items-center px-6 py-3 bg-sage-primary text-white rounded-full hover:bg-sage-deep transition-colors"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </button>
          )}

          {isRecording && (
            <>
              {!isPaused ? (
                <button
                  onClick={pauseRecording}
                  className="inline-flex items-center px-6 py-3 bg-warm-primary text-white rounded-full hover:bg-warm-deep transition-colors"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeRecording}
                  className="inline-flex items-center px-6 py-3 bg-warm-primary text-white rounded-full hover:bg-warm-deep transition-colors"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </button>
              )}
              <button
                onClick={stopRecording}
                className="inline-flex items-center px-6 py-3 bg-error-primary text-white rounded-full hover:bg-error-deep transition-colors"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop Recording
              </button>
            </>
          )}

          {audioBlob && (
            <>
              <button
                onClick={togglePlayback}
                className="inline-flex items-center px-6 py-3 bg-sage-light text-sage-deep rounded-full hover:bg-sage-primary hover:text-white transition-colors"
              >
                <Play className="w-5 h-5 mr-2" />
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={resetRecording}
                className="inline-flex items-center px-6 py-3 bg-warm-light text-warm-deep rounded-full hover:bg-warm-primary hover:text-white transition-colors"
              >
                Re-record
              </button>
              <button
                onClick={handleSave}
                disabled={recordingTime < minDuration || isConverting}
                className="inline-flex items-center px-6 py-3 bg-sage-primary text-white rounded-full hover:bg-sage-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Save Recording
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Conversion Progress */}
        {isConverting && (
          <div className="mt-4">
            <div className="text-center text-body-sm text-text-secondary mb-2">
              Converting to MP3 for voice preservation...
            </div>
            <div className="w-full bg-background-secondary rounded-full h-2">
              <div 
                className="bg-sage-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${conversionProgress}%` }}
              />
            </div>
            <div className="text-center text-body-xs text-text-secondary mt-1">
              {conversionProgress}%
            </div>
          </div>
        )}

        {/* Audio Player */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Instructions */}
        {!isRecording && !audioBlob && (
          <div className="text-center text-body-sm text-text-secondary">
            <p>Record your voice for at least {minDuration} seconds (up to {maxDuration / 60} minutes)</p>
            <p className="mt-1">Click the microphone button to begin</p>
          </div>
        )}

        {isRecording && (
          <div className="text-center text-body-sm text-text-secondary">
            {recordingTime < minDuration ? (
              <>
                <p className="text-warm-primary font-medium">
                  Keep recording for at least {minDuration - recordingTime} more seconds
                </p>
                <p className="mt-1">You can stop anytime, but we recommend at least {minDuration} seconds</p>
              </>
            ) : (
              <p>Great! You can stop recording whenever you&apos;re ready</p>
            )}
          </div>
        )}

        {/* Early Stop Warning Dialog */}
        {showEarlyStopWarning && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-heading-sm font-medium mb-2">Recording Too Short</h3>
              <p className="text-body-sm text-text-secondary mb-4">
                Your recording is only {recordingTime} seconds long. We recommend at least {minDuration} seconds for a meaningful memory.
              </p>
              <p className="text-body-sm text-text-secondary mb-6">
                Would you like to continue recording or discard this recording?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDiscardRecording}
                  className="px-4 py-2 border border-border-primary rounded-lg text-text-primary hover:bg-background-secondary transition-colors"
                >
                  Discard Recording
                </button>
                <button
                  onClick={handleContinueRecording}
                  className="px-4 py-2 bg-sage-primary text-white rounded-lg hover:bg-sage-deep transition-colors"
                >
                  Continue Recording
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}