import ffmpeg from 'fluent-ffmpeg'
import { Readable } from 'stream'
import path from 'path'

// Set FFmpeg path for serverless environments
if (process.env.NODE_ENV === 'production') {
  const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
  ffmpeg.setFfmpegPath(ffmpegPath)
}

export interface AudioConversionOptions {
  format: 'mp3' | 'wav' | 'm4a'
  bitrate?: string
  sampleRate?: number
}

/**
 * Convert audio buffer to a different format
 * @param inputBuffer - The input audio buffer
 * @param inputFormat - The format of the input audio (e.g., 'webm', 'ogg')
 * @param options - Conversion options
 * @returns Promise<Buffer> - The converted audio buffer
 */
export async function convertAudio(
  inputBuffer: Buffer,
  inputFormat: string,
  options: AudioConversionOptions = { format: 'mp3' }
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    
    // Create a readable stream from the buffer
    const inputStream = new Readable()
    inputStream.push(inputBuffer)
    inputStream.push(null)
    
    // Set up ffmpeg conversion
    const command = ffmpeg(inputStream)
      .inputFormat(inputFormat)
      .format(options.format)
    
    // Apply optional settings
    if (options.bitrate) {
      command.audioBitrate(options.bitrate)
    }
    
    if (options.sampleRate) {
      command.audioFrequency(options.sampleRate)
    }
    
    // For MP3, use good quality settings
    if (options.format === 'mp3') {
      command
        .audioBitrate(options.bitrate || '192k')
        .audioChannels(2)
        .audioCodec('libmp3lame')
    }
    
    // For M4A, use AAC codec
    if (options.format === 'm4a') {
      command
        .audioBitrate(options.bitrate || '192k')
        .audioChannels(2)
        .audioCodec('aac')
    }
    
    // Set up output stream
    command
      .on('error', (err) => {
        console.error('[Audio Conversion] FFmpeg error:', err)
        reject(new Error(`Audio conversion failed: ${err.message}`))
      })
      .on('end', () => {
        console.log('[Audio Conversion] Conversion completed')
        resolve(Buffer.concat(chunks))
      })
      .pipe()
      .on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })
  })
}

/**
 * Get the file extension from a mime type
 * @param mimeType - The mime type (e.g., 'audio/webm')
 * @returns The file extension (e.g., 'webm')
 */
export function getExtensionFromMimeType(mimeType: string): string {
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

/**
 * Check if audio format is supported by MiniMax
 * @param mimeType - The mime type to check
 * @returns boolean - true if supported
 */
export function isMiniMaxSupportedFormat(mimeType: string): boolean {
  const supportedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/x-m4a', 'audio/mp4']
  return supportedTypes.includes(mimeType.toLowerCase())
}

/**
 * Get the target format for MiniMax conversion
 * @param originalMimeType - The original mime type
 * @returns The target format for conversion
 */
export function getTargetFormatForMiniMax(originalMimeType: string): AudioConversionOptions {
  // If already supported, keep the same format
  if (isMiniMaxSupportedFormat(originalMimeType)) {
    const ext = getExtensionFromMimeType(originalMimeType)
    return { format: ext as 'mp3' | 'wav' | 'm4a' }
  }
  
  // Default to MP3 for unsupported formats
  return { 
    format: 'mp3',
    bitrate: '192k' // Good quality for voice
  }
}