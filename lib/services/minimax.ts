import { z } from 'zod'

// JWT validation helper
function isValidJWT(token: string): boolean {
  if (!token) return false
  
  const parts = token.split('.')
  if (parts.length !== 3) {
    console.error('[MiniMax] Invalid JWT format: Expected 3 parts, got', parts.length)
    return false
  }
  
  try {
    // Try to decode the header and payload (not verifying signature)
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString())
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    
    console.log('[MiniMax] JWT validation:', {
      algorithm: header.alg,
      type: header.typ,
      issuer: payload.iss,
      hasGroupId: !!payload.GroupID,
      hasSubjectId: !!payload.SubjectID
    })
    
    return true
  } catch (e) {
    console.error('[MiniMax] Failed to decode JWT:', e)
    return false
  }
}

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
  
  console.log('[MiniMax] Loading environment variables...')
  
  const envVars = {
    MINIMAX_API_KEY: process.env.MINIMAX_API_KEY,
    MINIMAX_API_HOST: process.env.MINIMAX_API_HOST,
    MINIMAX_GROUP_ID: process.env.MINIMAX_GROUP_ID
  }
  
  // Log which variables are present (without exposing sensitive data)
  console.log('[MiniMax] Environment check:', {
    hasApiKey: !!envVars.MINIMAX_API_KEY,
    apiKeyLength: envVars.MINIMAX_API_KEY?.length || 0,
    hasApiHost: !!envVars.MINIMAX_API_HOST,
    apiHost: envVars.MINIMAX_API_HOST || 'NOT SET',
    hasGroupId: !!envVars.MINIMAX_GROUP_ID,
    groupId: envVars.MINIMAX_GROUP_ID || 'NOT SET'
  })
  
  // Validate JWT format before parsing with Zod
  if (envVars.MINIMAX_API_KEY && !isValidJWT(envVars.MINIMAX_API_KEY)) {
    console.error('[MiniMax] API key appears to be invalid JWT format')
  }
  
  try {
    cachedEnv = envSchema.parse(envVars)
    console.log('[MiniMax] Environment variables loaded successfully')
    return cachedEnv
  } catch (error) {
    console.error('[MiniMax] Environment validation failed:', error)
    
    // Provide more specific error messages
    const missingVars = []
    if (!envVars.MINIMAX_API_KEY) missingVars.push('MINIMAX_API_KEY')
    if (!envVars.MINIMAX_API_HOST) missingVars.push('MINIMAX_API_HOST')
    if (!envVars.MINIMAX_GROUP_ID) missingVars.push('MINIMAX_GROUP_ID')
    
    throw new MiniMaxError(
      `MiniMax API configuration is missing. Missing variables: ${missingVars.join(', ')}. Please set these environment variables in Vercel.`,
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

// Voice Clone API Response (synchronous)
export interface MiniMaxVoiceCloneResponse {
  input_sensitive: boolean
  input_sensitive_type?: number
  base_resp: {
    status_code: number
    status_msg: string
  }
  // Optional preview fields if text was provided
  audio_file?: {
    url: string
    duration: number
    size: number
  }
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
  const env = getEnv()
  const url = `${env.MINIMAX_API_HOST}${endpoint}?GroupId=${env.MINIMAX_GROUP_ID}`
  
  console.log(`[MiniMax] Making request to: ${endpoint}`)
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${env.MINIMAX_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  })
  
  const responseText = await response.text()
  let data: any
  
  try {
    data = JSON.parse(responseText)
  } catch (e) {
    console.error('[MiniMax] Failed to parse response:', responseText)
    throw new MiniMaxError(
      `Invalid JSON response from MiniMax API: ${responseText}`,
      'INVALID_RESPONSE',
      response.status
    )
  }
  
  if (!response.ok) {
    console.error('[MiniMax] API request failed:', {
      status: response.status,
      statusText: response.statusText,
      endpoint,
      error: data
    })
    
    // Check for specific authentication errors
    if (response.status === 401 || response.status === 403) {
      throw new MiniMaxError(
        `Authentication failed: ${data.message || 'Invalid API key or insufficient permissions'}. Please verify your MINIMAX_API_KEY is correct.`,
        data.code || 'AUTH_ERROR',
        response.status
      )
    }
    
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
  formData.append('purpose', 'voice_clone')
  
  return retryWithBackoff(async () => {
    const env = getEnv()
    const url = `${env.MINIMAX_API_HOST}/v1/files/upload?GroupId=${env.MINIMAX_GROUP_ID}`
    
    console.log('[MiniMax] Uploading audio file:', { filename, mimeType, size: audioBuffer.length })
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.MINIMAX_API_KEY}`
      },
      body: formData
    })
    
    const responseText = await response.text()
    let data: any
    
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('[MiniMax] Failed to parse upload response:', responseText)
      throw new MiniMaxError(
        `Invalid JSON response from file upload: ${responseText}`,
        'INVALID_RESPONSE',
        response.status
      )
    }
    
    if (!response.ok) {
      console.error('[MiniMax] File upload failed:', {
        status: response.status,
        statusText: response.statusText,
        error: data,
        fullResponse: JSON.stringify(data, null, 2)
      })
      
      // Check for specific authentication errors
      if (response.status === 401 || response.status === 403) {
        throw new MiniMaxError(
          `Authentication failed during file upload: ${data.message || 'Invalid API key'}`,
          data.code || 'AUTH_ERROR',
          response.status
        )
      }
      
      throw new MiniMaxError(
        data.message || `File upload failed: ${response.statusText}`,
        data.code,
        response.status
      )
    }
    
    console.log('[MiniMax] File upload response:', JSON.stringify(data, null, 2))
    
    // Extract file_id from the response structure
    if (data.file && data.file.file_id) {
      console.log('[MiniMax] File uploaded successfully:', data.file.file_id)
      return data.file as MiniMaxFileUploadResponse
    } else if (data.file_id) {
      // Fallback if response structure is different
      console.log('[MiniMax] File uploaded successfully:', data.file_id)
      return data as MiniMaxFileUploadResponse
    } else {
      throw new MiniMaxError(
        'Invalid response format: missing file_id',
        'INVALID_RESPONSE_FORMAT',
        500
      )
    }
  })
}

// Voice cloning (synchronous operation)
export async function cloneVoice(
  fileId: string,
  voiceId: string,
  modelType: 'speech-02-hd' | 'speech-02-turbo' = 'speech-02-hd',
  previewText?: string
): Promise<MiniMaxVoiceCloneResponse> {
  // Validate voice ID (must be 8+ chars, start with letter)
  if (!/^[a-zA-Z][a-zA-Z0-9]{7,}$/.test(voiceId)) {
    throw new MiniMaxError(
      'Voice ID must be at least 8 characters and start with a letter',
      'INVALID_VOICE_ID'
    )
  }
  
  console.log(`[MiniMax] Cloning voice with ID: ${voiceId}, file: ${fileId}`)
  
  const response = await retryWithBackoff(async () => {
    const body: any = {
      file_id: fileId,
      voice_id: voiceId,
      model: modelType,
      need_noise_reduction: false,
      need_volume_normalization: false,
      accuracy: 0.7
    }
    
    // Add preview text if provided
    if (previewText) {
      body.text = previewText.substring(0, 2000) // Max 2000 chars
    }
    
    return makeRequest<MiniMaxVoiceCloneResponse>('/v1/voice_clone', {
      method: 'POST',
      body: JSON.stringify(body)
    })
  })
  
  // Check if cloning was successful
  if (response.base_resp.status_code !== 0) {
    throw new MiniMaxError(
      `Voice cloning failed: ${response.base_resp.status_msg}`,
      'CLONE_FAILED',
      500
    )
  }
  
  console.log(`[MiniMax] Voice cloned successfully: ${voiceId}`)
  return response
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

// Note: Voice cloning is synchronous - there's no status check endpoint
// The clone operation completes immediately with success or failure

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