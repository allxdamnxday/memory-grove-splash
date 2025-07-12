import lamejs from '@breezystack/lamejs'

export interface ConversionOptions {
  bitrate?: number
  sampleRate?: number
  channels?: number
  onProgress?: (progress: number) => void
}

/**
 * Convert float32 samples to int16 for MP3 encoding
 */
function convertFloat32ToInt16(buffer: Float32Array): Int16Array {
  const l = buffer.length
  const buf = new Int16Array(l)
  for (let i = 0; i < l; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]))
    buf[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
  }
  return buf
}

/**
 * Convert audio blob to MP3 format using lamejs
 * @param audioBlob - The input audio blob (WebM, OGG, etc.)
 * @param options - Conversion options
 * @returns Promise<Blob> - The converted MP3 blob
 */
export async function convertToMp3(
  audioBlob: Blob,
  options: ConversionOptions = {}
): Promise<Blob> {
  const {
    bitrate = 128,
    sampleRate = 44100,
    channels = 1, // Mono for voice
    onProgress
  } = options

  try {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Decode audio data
    const arrayBuffer = await audioBlob.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    
    // Get channel data (convert to mono if stereo)
    let samples: Float32Array
    if (audioBuffer.numberOfChannels > 1 && channels === 1) {
      // Mix stereo to mono
      const left = audioBuffer.getChannelData(0)
      const right = audioBuffer.getChannelData(1)
      samples = new Float32Array(left.length)
      for (let i = 0; i < left.length; i++) {
        samples[i] = (left[i] + right[i]) / 2
      }
    } else {
      samples = audioBuffer.getChannelData(0)
    }
    
    // Resample if necessary
    if (audioBuffer.sampleRate !== sampleRate) {
      const resampleRatio = sampleRate / audioBuffer.sampleRate
      const newLength = Math.round(samples.length * resampleRatio)
      const resampled = new Float32Array(newLength)
      
      for (let i = 0; i < newLength; i++) {
        const srcIndex = i / resampleRatio
        const srcIndexInt = Math.floor(srcIndex)
        const srcIndexFrac = srcIndex - srcIndexInt
        
        if (srcIndexInt + 1 < samples.length) {
          resampled[i] = samples[srcIndexInt] * (1 - srcIndexFrac) + samples[srcIndexInt + 1] * srcIndexFrac
        } else {
          resampled[i] = samples[srcIndexInt]
        }
      }
      
      samples = resampled
    }
    
    // Create MP3 encoder
    const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, bitrate)
    
    // Convert and encode samples
    const mp3Data: Uint8Array[] = []
    const sampleBlockSize = 1152 // Must be multiple of 576 for encoder
    let totalSamples = samples.length
    let samplesProcessed = 0
    
    // Process in chunks
    for (let i = 0; i < samples.length; i += sampleBlockSize) {
      const sampleChunk = samples.subarray(i, Math.min(i + sampleBlockSize, samples.length))
      
      // Pad the last chunk if necessary
      let finalChunk = sampleChunk
      if (sampleChunk.length < sampleBlockSize) {
        finalChunk = new Float32Array(sampleBlockSize)
        finalChunk.set(sampleChunk)
      }
      
      const int16Samples = convertFloat32ToInt16(finalChunk)
      const mp3buf = mp3encoder.encodeBuffer(int16Samples)
      
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf)
      }
      
      // Report progress
      samplesProcessed += sampleChunk.length
      if (onProgress) {
        const progress = Math.min(100, Math.floor((samplesProcessed / totalSamples) * 100))
        onProgress(progress)
      }
    }
    
    // Flush remaining samples
    const mp3buf = mp3encoder.flush()
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf)
    }
    
    // Combine all chunks into a single blob
    const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' })
    
    // Clean up
    audioContext.close()
    
    return mp3Blob
  } catch (error) {
    console.error('[Audio Converter] Conversion failed:', error)
    throw new Error(`Failed to convert audio: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Voice-optimized presets for Memory Grove
 */
export const VOICE_PRESETS = {
  high: {
    bitrate: 192,
    sampleRate: 44100,
    channels: 1
  },
  standard: {
    bitrate: 128,
    sampleRate: 44100,
    channels: 1
  },
  efficient: {
    bitrate: 96,
    sampleRate: 22050,
    channels: 1
  }
} as const

/**
 * Convert audio for voice preservation with optimized settings
 */
export async function convertForVoicePreservation(
  audioBlob: Blob,
  preset: keyof typeof VOICE_PRESETS = 'standard',
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const settings = VOICE_PRESETS[preset]
  return convertToMp3(audioBlob, {
    ...settings,
    onProgress
  })
}

/**
 * Check if a blob is already in MP3 format
 */
export function isMp3Format(blob: Blob): boolean {
  return blob.type === 'audio/mp3' || blob.type === 'audio/mpeg'
}

/**
 * Check if the audio format is supported by MiniMax
 */
export function isMiniMaxCompatible(mimeType: string): boolean {
  const supportedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/x-m4a', 'audio/mp4']
  return supportedTypes.includes(mimeType.toLowerCase())
}

/**
 * Get file extension from mime type
 */
export function getAudioExtension(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/ogg': 'ogg',
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/wav': 'wav',
    'audio/x-wav': 'wav',
    'audio/x-m4a': 'm4a',
    'audio/mp4': 'm4a',
  }
  
  return mimeToExt[mimeType.toLowerCase()] || 'mp3'
}