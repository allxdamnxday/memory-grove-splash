import { z } from 'zod'

// Environment validation
const envSchema = z.object({
  MINIMAX_API_KEY: z.string().min(1),
  MINIMAX_API_HOST: z.string().url(),
  MINIMAX_GROUP_ID: z.string().min(1)
})

// Lazy environment loading to avoid build-time errors
let cachedEnv: z.infer<typeof envSchema> | null = null

function getEnv() {
  if (cachedEnv) return cachedEnv
  
  try {
    cachedEnv = envSchema.parse({
      MINIMAX_API_KEY: process.env.MINIMAX_API_KEY,
      MINIMAX_API_HOST: process.env.MINIMAX_API_HOST,
      MINIMAX_GROUP_ID: process.env.MINIMAX_GROUP_ID
    })
    return cachedEnv
  } catch (error) {
    throw new MiniMaxError(
      'MiniMax API configuration is missing. Please set MINIMAX_API_KEY, MINIMAX_API_HOST, and MINIMAX_GROUP_ID environment variables.',
      'CONFIG_ERROR'
    )
  }
}

// API response types
export interface MiniMaxFileUploadResponse {
  file_id: string
  filename: string
  size: number
  created_at: string
}

export interface MiniMaxVoiceCloneResponse {
  voice_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message?: string
  processing_time?: number
}

export interface MiniMaxSynthesisResponse {
  audio_url: string
  duration: number
  request_id: string
}

// Error types
export class MiniMaxError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'MiniMaxError'
  }
}

// Rate limiting
const rateLimiter = {
  lastRequest: 0,
  minInterval: 100, // 100ms between requests
  
  async throttle() {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequest
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastRequest))
    }
    this.lastRequest = Date.now()
  }
}

// Retry logic with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | null = null
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      await rateLimiter.throttle()
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on client errors (4xx)
      if (error instanceof MiniMaxError && error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        throw error
      }
      
      // Exponential backoff
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError || new Error('Unknown error in retry logic')
}

// Base API request helper
async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${getEnv().MINIMAX_API_HOST}${endpoint}?GroupId=${getEnv().MINIMAX_GROUP_ID}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${getEnv().MINIMAX_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new MiniMaxError(
      data.message || `API request failed: ${response.statusText}`,
      data.code,
      response.status
    )
  }
  
  return data
}

// File upload for voice cloning
export async function uploadAudioFile(
  audioBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<MiniMaxFileUploadResponse> {
  // Validate file size (20MB max)
  const MAX_FILE_SIZE = 20 * 1024 * 1024
  if (audioBuffer.length > MAX_FILE_SIZE) {
    throw new MiniMaxError('File size exceeds 20MB limit', 'FILE_TOO_LARGE')
  }
  
  // Create FormData
  const formData = new FormData()
  const blob = new Blob([audioBuffer], { type: mimeType })
  formData.append('file', blob, filename)
  
  return retryWithBackoff(async () => {
    const url = `${getEnv().MINIMAX_API_HOST}/v1/files/upload?GroupId=${getEnv().MINIMAX_GROUP_ID}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getEnv().MINIMAX_API_KEY}`
      },
      body: formData
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new MiniMaxError(
        data.message || `File upload failed: ${response.statusText}`,
        data.code,
        response.status
      )
    }
    
    return data
  })
}

// Voice cloning
export async function cloneVoice(
  fileId: string,
  voiceId: string,
  modelType: 'speech-02-hd' | 'speech-02-turbo' = 'speech-02-hd'
): Promise<MiniMaxVoiceCloneResponse> {
  // Validate voice ID (must be 8+ chars, start with letter)
  if (!/^[a-zA-Z][a-zA-Z0-9]{7,}$/.test(voiceId)) {
    throw new MiniMaxError(
      'Voice ID must be at least 8 characters and start with a letter',
      'INVALID_VOICE_ID'
    )
  }
  
  return retryWithBackoff(async () => {
    return makeRequest<MiniMaxVoiceCloneResponse>('/v1/voice_clone', {
      method: 'POST',
      body: JSON.stringify({
        file_id: fileId,
        voice_id: voiceId,
        model: modelType
      })
    })
  })
}

// Speech synthesis
export interface SynthesisOptions {
  text: string
  voiceId: string
  emotion?: 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised' | 'neutral'
  model?: 'speech-02-hd' | 'speech-02-turbo' | 'speech-01-hd' | 'speech-01-turbo'
  speed?: number // 0.5 to 2.0
  volume?: number // 0.1 to 10.0
  pitch?: number // -12 to 12
  outputFormat?: 'mp3' | 'pcm' | 'flac' | 'wav'
}

export async function synthesizeSpeech(
  options: SynthesisOptions
): Promise<MiniMaxSynthesisResponse> {
  const {
    text,
    voiceId,
    emotion = 'neutral',
    model = 'speech-02-hd',
    speed = 1.0,
    volume = 1.0,
    pitch = 0,
    outputFormat = 'mp3'
  } = options
  
  // Validate text length (10 million chars max)
  if (text.length > 10_000_000) {
    throw new MiniMaxError('Text exceeds maximum length of 10 million characters', 'TEXT_TOO_LONG')
  }
  
  // Validate parameters
  if (speed < 0.5 || speed > 2.0) {
    throw new MiniMaxError('Speed must be between 0.5 and 2.0', 'INVALID_SPEED')
  }
  
  if (volume < 0.1 || volume > 10.0) {
    throw new MiniMaxError('Volume must be between 0.1 and 10.0', 'INVALID_VOLUME')
  }
  
  if (pitch < -12 || pitch > 12) {
    throw new MiniMaxError('Pitch must be between -12 and 12', 'INVALID_PITCH')
  }
  
  return retryWithBackoff(async () => {
    return makeRequest<MiniMaxSynthesisResponse>('/v1/text_to_speech', {
      method: 'POST',
      body: JSON.stringify({
        voice_id: voiceId,
        text,
        model,
        emotion,
        speed,
        volume,
        pitch,
        output_format: outputFormat,
        noise_reduction: true,
        need_volume_normalization: true,
        accuracy: 0.8 // Text validation threshold
      })
    })
  })
}

// Voice cloning status check
export async function checkVoiceCloneStatus(
  voiceId: string
): Promise<MiniMaxVoiceCloneResponse> {
  return retryWithBackoff(async () => {
    return makeRequest<MiniMaxVoiceCloneResponse>(`/v1/voice_clone/status/${voiceId}`, {
      method: 'GET'
    })
  })
}

// Helper to download audio file
export async function downloadAudioFile(url: string): Promise<Buffer> {
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new MiniMaxError(`Failed to download audio file: ${response.statusText}`)
  }
  
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

// Emotion detection from audio (for future use)
export interface EmotionProfile {
  dominant: string
  confidence: number
  emotions: Record<string, number>
}

export async function analyzeVoiceEmotion(
  fileId: string
): Promise<EmotionProfile> {
  // This is a placeholder for future emotion analysis
  // MiniMax may add this feature in the future
  return {
    dominant: 'neutral',
    confidence: 0.8,
    emotions: {
      happy: 0.2,
      sad: 0.1,
      angry: 0.1,
      fearful: 0.1,
      disgusted: 0.1,
      surprised: 0.1,
      neutral: 0.3
    }
  }
}

// Cost estimation helper
export function estimateCost(
  operation: 'clone' | 'synthesis',
  duration?: number
): number {
  // Rough estimates based on typical pricing
  // These should be updated based on actual MiniMax pricing
  if (operation === 'clone') {
    return 0.10 // $0.10 per voice clone
  } else {
    // Synthesis cost based on duration
    const minutes = (duration || 0) / 60
    return minutes * 0.02 // $0.02 per minute
  }
}