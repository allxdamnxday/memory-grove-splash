# Voice Cloning Feature Documentation

This document outlines the implementation of the voice cloning feature for Memory Grove, allowing users to generate new audio content in their own voice using AI technology.

## Overview

The voice cloning feature enables users to:
- Create voice profiles from their existing recordings
- Generate new audio from text using their voice profile
- Manage multiple voice profiles
- Clearly distinguish between original and AI-generated content

## Technical Architecture

### Database Schema

#### New Tables

1. **`voice_profiles`**
   - `id` (UUID) - Primary key
   - `user_id` (UUID) - Foreign key to profiles
   - `name` (TEXT) - Profile name
   - `model_id` (TEXT) - Minimax.io model ID
   - `status` (TEXT) - pending/training/ready/failed
   - `training_audio_urls` (TEXT[]) - Array of audio URLs used
   - `metadata` (JSONB) - Additional metadata
   - `created_at`, `updated_at` (TIMESTAMPTZ)

2. **`voice_cloning_logs`**
   - `id` (UUID) - Primary key
   - `user_id` (UUID) - Foreign key
   - `voice_profile_id` (UUID) - Optional foreign key
   - `action` (TEXT) - create_profile/generate_audio/delete_profile
   - `metadata` (JSONB) - Action details
   - `ip_address` (INET) - User IP
   - `created_at` (TIMESTAMPTZ)

#### Updated Tables

- **`profiles`**
  - Added `voice_clone_consent` (BOOLEAN)
  - Added `voice_clone_consent_date` (TIMESTAMPTZ)

- **`memories`**
  - Added `is_cloned` (BOOLEAN)
  - Added `source_text` (TEXT)
  - Added `voice_profile_id` (UUID)

### API Integration

#### Minimax.io Service (`lib/services/minimax.ts`)
- Voice profile creation
- Profile status checking
- Text-to-speech generation
- Error handling and retries
- Rate limiting support

### API Endpoints

#### `/api/voice-profile`
- **GET**: List user's voice profiles
- **POST**: Create new voice profile
- **DELETE**: Remove voice profile

#### `/api/voice-profile/status`
- **GET**: Check training status of a profile

#### `/api/memories/clone`
- **POST**: Generate cloned audio from text

#### `/api/user`
- **GET**: Get user profile including consent status

### Frontend Components

#### Voice Management
- `VoiceCloneConsent`: Consent management in account settings
- `VoiceProfileList`: Display and manage voice profiles
- `CreateVoiceProfile`: Create new profiles from recordings
- `VoiceCloneGenerator`: Generate audio from text

#### UI Updates
- `MemoryCard`: Shows "AI Generated" badge for cloned audio
- `CreateMemory`: Added AI Voice option when profiles exist

## User Flow

### Initial Setup
1. User navigates to Account Settings
2. Reviews voice cloning information
3. Grants consent by toggling the switch
4. Confirmation dialog explains the implications

### Creating Voice Profile
1. User goes to Voice Profiles page
2. Clicks "Create New Profile"
3. Names the profile
4. Selects 1-10 recordings (30s-10min each)
5. Submits for training
6. Profile shows training status

### Generating Cloned Audio
1. User creates new memory
2. Selects "AI Voice" option
3. Chooses voice profile
4. Enters text to convert
5. Adjusts speed/pitch if desired
6. Generates and saves audio

## Security & Privacy

### Consent Management
- Explicit consent required before any voice cloning
- Consent can be revoked at any time
- Consent date tracked for compliance

### Access Control
- Row Level Security (RLS) ensures users only access their own data
- API endpoints verify user ownership
- Rate limiting prevents abuse (10 clones/hour)

### Data Protection
- Voice profiles can be deleted at any time
- Audit logs track all voice cloning activities
- Clear labeling of AI-generated content

## Configuration

### Environment Variables
```bash
# Minimax.io API
MINIMAX_API_KEY=your_minimax_api_key
MINIMAX_API_URL=https://api.minimax.io/v1
```

### Validation Rules
- Training audio: 30s-10min duration, max 25MB
- Text input: 1-5000 characters
- Profile names: 3-50 characters
- Max 10 training samples per profile

## Future Enhancements

### Planned Features
1. Voice profile quality indicators
2. Batch text-to-speech generation
3. Voice style variations (emotions, tones)
4. Multiple language support
5. Voice profile sharing (with consent)
6. Advanced audio post-processing

### Technical Improvements
1. Webhook support for training completion
2. Progressive training updates
3. Caching for frequently used profiles
4. Compression for stored audio
5. Background job processing

## Monitoring & Analytics

### Key Metrics
- Voice profile creation rate
- Training success/failure ratio
- Average generation time
- API usage and costs
- User engagement with feature

### Error Tracking
- Failed training attempts
- API timeouts
- Rate limit hits
- Consent revocations

## Ethical Considerations

### User Education
- Clear explanation of technology
- Warnings about potential misuse
- Best practices guide
- Terms of service updates

### Content Moderation
- Prohibited use cases defined
- Automated content filtering
- Manual review process
- Violation reporting system

### Transparency
- All AI content clearly labeled
- Generation metadata preserved
- User control over their data
- Regular audits and reports