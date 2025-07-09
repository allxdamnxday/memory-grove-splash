# Audio Recording and Upload Feature

This document outlines the implementation of the audio recording and upload functionality for Memory Grove.

## Overview

The audio feature allows users to:
- Record audio directly in the browser using the Web Audio API
- Upload existing audio files (MP3, WAV, M4A, WebM)
- Store audio files securely in Supabase Storage
- Play back recordings with a custom audio player
- Manage their collection of voice memories

## Technical Implementation

### Database Schema

#### `memories` Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to profiles table
- `title` (TEXT) - Memory title
- `description` (TEXT) - Optional description
- `audio_url` (TEXT) - Path to file in storage
- `duration` (INTEGER) - Duration in seconds
- `file_size` (BIGINT) - File size in bytes
- `file_type` (TEXT) - MIME type
- `transcription` (TEXT) - Optional transcription
- `scheduled_for` (TIMESTAMPTZ) - Optional scheduled release
- `is_public` (BOOLEAN) - Public visibility flag
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

### Storage Buckets

1. **voice-memories** - Private bucket for audio files
   - Path structure: `{user_id}/{memory_id}/{filename}`
   - Max file size: 50MB
   - Allowed types: MP3, WAV, M4A, WebM

2. **avatars** - Public bucket for user profile images
   - Path structure: `{user_id}/{filename}`
   - Max file size: 5MB
   - Allowed types: JPEG, PNG, GIF, WebP

### API Endpoints

#### POST `/api/memories/upload`
- Handles audio file uploads
- Validates file type, size, and duration
- Creates database record and storage entry
- Returns signed URL for playback

#### GET `/api/memories`
- Fetches user's memories with pagination
- Generates signed URLs for audio playback
- Supports page/limit query parameters

#### DELETE `/api/memories`
- Deletes memory from database and storage
- Requires memory ID as query parameter

### Frontend Components

#### AudioRecorder
- Records audio using MediaRecorder API
- Shows recording time and controls
- Supports pause/resume functionality
- Validates minimum/maximum duration

#### AudioUploader
- Drag-and-drop file upload interface
- Client-side file validation
- Audio duration verification
- File type and size checks

#### CreateMemory
- Combined interface for recording/uploading
- Form for memory title and description
- Upload progress tracking
- Error handling and user feedback

#### AudioPlayer
- Custom audio player with controls
- Progress bar with seek functionality
- Volume control and mute toggle
- Download option for memories

#### MemoryCard
- Displays memory information
- Embedded audio player
- Delete functionality with confirmation
- Shows duration, size, and creation date

#### MemoriesList
- Grid layout of memory cards
- Pagination controls
- Empty state with call-to-action
- Loading and error states

## User Flow

1. User navigates to `/account/memories`
2. Clicks "New Memory" to go to `/account/memories/new`
3. Chooses between recording or uploading
4. Records audio or selects file
5. Adds title and optional description
6. Submits form to save memory
7. Redirected to memories list
8. Can play, download, or delete memories

## Security Considerations

- Row Level Security (RLS) policies ensure users can only access their own data
- Storage policies restrict file access to owner
- File type validation on both client and server
- Size limits enforced at multiple levels
- Signed URLs for secure temporary access

## Future Enhancements

- Audio transcription using AI services
- Voice cloning integration with minimax.io
- Scheduled memory releases
- Public memory sharing
- Audio waveform visualization
- Batch upload functionality
- Memory categories/tags
- Search functionality