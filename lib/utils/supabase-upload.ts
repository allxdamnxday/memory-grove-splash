import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

export interface UploadOptions {
  bucket: string
  path?: string
  onProgress?: (progress: number) => void
}

export interface UploadResult {
  path: string
  fullPath: string
  url: string
  size: number
}

/**
 * Upload a file directly to Supabase Storage from the client
 * Bypasses API routes to avoid Vercel's 4.5MB limit
 */
export async function uploadToSupabase(
  file: File | Blob,
  options: UploadOptions
): Promise<UploadResult> {
  const supabase = createClient()
  
  // Generate unique filename
  const fileExt = file instanceof File 
    ? file.name.split('.').pop() 
    : file.type.split('/')[1] || 'bin'
  const fileName = `${uuidv4()}.${fileExt}`
  
  // Construct full path
  const fullPath = options.path 
    ? `${options.path}/${fileName}`
    : fileName
  
  try {
    // Upload file with progress tracking if supported
    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false,
        // Note: Browser doesn't support upload progress for Supabase
        // We'll simulate progress based on file size
      })
    
    if (error) {
      console.error('[Supabase Upload] Upload failed:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }
    
    if (!data) {
      throw new Error('Upload succeeded but no data returned')
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(data.path)
    
    // Return upload result
    return {
      path: data.path,
      fullPath: data.fullPath || data.path,
      url: urlData.publicUrl,
      size: file.size
    }
  } catch (error) {
    console.error('[Supabase Upload] Error:', error)
    throw error
  }
}

/**
 * Upload audio file for memory preservation
 * Includes validation and proper path structure
 */
export async function uploadMemoryAudio(
  audioFile: File | Blob,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  // Validate file size (50MB max)
  const MAX_SIZE = 50 * 1024 * 1024
  if (audioFile.size > MAX_SIZE) {
    throw new Error('Audio file exceeds 50MB limit')
  }
  
  // Validate file type
  const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/x-m4a', 'audio/mp4', 'audio/webm', 'audio/ogg']
  const fileType = audioFile.type || (audioFile instanceof File ? getMimeFromExtension(audioFile.name) : 'audio/mp3')
  
  if (!validTypes.includes(fileType)) {
    throw new Error(`Invalid audio format: ${fileType}`)
  }
  
  // Upload to user's folder in voice-memories bucket
  return uploadToSupabase(audioFile, {
    bucket: 'voice-memories',
    path: userId,
    onProgress
  })
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFromSupabase(
  bucket: string,
  path: string
): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) {
    console.error('[Supabase Delete] Delete failed:', error)
    throw new Error(`Delete failed: ${error.message}`)
  }
}

/**
 * Get MIME type from file extension
 */
function getMimeFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const mimeMap: Record<string, string> = {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'm4a': 'audio/x-m4a',
    'webm': 'audio/webm',
    'ogg': 'audio/ogg'
  }
  return mimeMap[ext || ''] || 'audio/mpeg'
}

/**
 * Check if user has permission to upload
 * (Supabase RLS policies should handle this, but we can add client-side checks)
 */
export async function checkUploadPermission(): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

/**
 * Get storage usage for a user
 */
export async function getUserStorageUsage(userId: string): Promise<{
  totalSize: number
  fileCount: number
}> {
  const supabase = createClient()
  
  const { data, error } = await supabase.storage
    .from('voice-memories')
    .list(userId)
  
  if (error) {
    console.error('[Supabase Storage] Failed to get usage:', error)
    return { totalSize: 0, fileCount: 0 }
  }
  
  const totalSize = data?.reduce((sum, file) => sum + (file.metadata?.size || 0), 0) || 0
  const fileCount = data?.length || 0
  
  return { totalSize, fileCount }
}