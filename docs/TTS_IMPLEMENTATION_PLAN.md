# MiniMax Text-to-Speech (TTS) Implementation Plan

## Project Status
✅ Voice cloning is working successfully  
✅ Audio conversion issues resolved  
✅ Upload size limits fixed  
🎯 **Next Phase: Implement TTS feature for users to generate speech from text**

## Overview
Implement a complete TTS feature allowing users to generate speech from text using their cloned voice profiles. Users can input text (up to 5000 chars) and generate MP3 audio using their trained voices.

## 1. Database Schema Updates

### New Table: `synthesized_audio`
```sql
CREATE TABLE synthesized_audio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  voice_profile_id UUID REFERENCES voice_profiles(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  text_hash VARCHAR(64), -- SHA256 hash for caching duplicate requests
  audio_url TEXT NOT NULL, -- Path in Supabase storage
  duration INTEGER, -- in seconds
  file_size INTEGER, -- in bytes
  file_type VARCHAR(50) DEFAULT 'audio/mp3',
  model VARCHAR(50) DEFAULT 'speech-02-hd',
  voice_settings JSONB, -- {"speed": 1.0, "volume": 1.0, "pitch": 0, "emotion": "neutral"}
  audio_settings JSONB, -- {"sample_rate": 32000, "bitrate": 128000, "format": "mp3"}
  usage_characters INTEGER,
  cost_estimate DECIMAL(10,4),
  minimax_trace_id VARCHAR(255), -- For debugging
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_synthesized_audio_user_voice ON synthesized_audio(user_id, voice_profile_id);
CREATE INDEX idx_synthesized_audio_text_hash ON synthesized_audio(text_hash);
CREATE INDEX idx_synthesized_audio_created ON synthesized_audio(created_at DESC);
```

### Storage Structure
- Bucket: `voice-memories` (existing)
- Path: `{user_id}/synthesized/{audio_id}.mp3`

## 2. MiniMax TTS API Integration

### API Documentation Reference
- **HTTP API**: `https://api.minimaxi.chat/v1/t2a_v2`
- **Models**: `speech-02-hd`, `speech-02-turbo`, `speech-01-hd`, `speech-01-turbo`
- **Max text**: 5000 characters
- **Pause syntax**: `<#x#>` where x = seconds (0.01-99.99)
- **Response**: Hex-encoded audio data

### Required Implementation: `lib/services/minimax-tts.ts`
```typescript
import { z } from 'zod'

export interface TTSOptions {
  text: string
  voice_id: string
  model?: 'speech-02-hd' | 'speech-02-turbo' | 'speech-01-hd' | 'speech-01-turbo'
  voice_settings?: {
    speed?: number // 0.5-2.0
    volume?: number // 0.1-5.0
    pitch?: number // -12 to 12
    emotion?: string // 'neutral', 'happy', 'sad', etc.
  }
  audio_settings?: {
    sample_rate?: number // 8000, 16000, 22050, 24000, 32000, 44100, 48000
    bitrate?: number // 64000, 128000, 256000
    format?: 'mp3' | 'wav' | 'pcm' | 'flac'
    channel?: 1 | 2 // mono or stereo
  }
  stream?: boolean
}

export interface TTSResult {
  audio_buffer: Buffer
  duration: number
  size: number
  format: string
  trace_id: string
  usage_characters: number
}

export class MiniMaxTTS {
  // Main synthesis function
  async synthesizeText(options: TTSOptions): Promise<TTSResult>
  
  // Helper to convert hex to buffer
  private hexToBuffer(hex: string): Buffer
  
  // Cost estimation
  estimateCost(text: string): number
}
```

### Request Format to MiniMax
```typescript
const requestBody = {
  model: 'speech-02-hd',
  text: text,
  stream: false,
  voice_setting: {
    voice_id: voice_id, // From voice_profiles.minimax_voice_id
    speed: 1.0,
    vol: 1.0,
    pitch: 0
  },
  audio_setting: {
    sample_rate: 32000,
    bitrate: 128000,
    format: 'mp3',
    channel: 1
  }
}
```

## 3. API Routes

### `/api/voice/synthesize/route.ts` (POST)
```typescript
interface SynthesizeRequest {
  text: string
  voice_profile_id: string
  voice_settings?: {
    speed?: number
    volume?: number
    pitch?: number
    emotion?: string
  }
  audio_settings?: {
    format?: string
    sample_rate?: number
    bitrate?: number
  }
}

interface SynthesizeResponse {
  id: string
  audio_url: string
  duration: number
  file_size: number
  usage_characters: number
  cost_estimate: number
}
```

### `/api/voice/synthesize/history/route.ts` (GET)
- Paginated list of user's synthesis history
- Filter by voice_profile_id
- Search by text content

## 4. UI Components

### `components/voice/TextToSpeech.tsx`
```typescript
interface TextToSpeechProps {
  voiceProfiles: VoiceProfile[]
}

// Features needed:
// - Textarea with character counter (0/5000)
// - Voice profile selector dropdown
// - Advanced settings panel (speed, pitch, volume)
// - Generate button with loading state
// - Audio player for preview
// - Download button
// - Save to library option
```

### `components/voice/SynthesisHistory.tsx`
```typescript
// Display table of previous generations
// Columns: Date, Text (truncated), Voice, Duration, Actions
// Actions: Play, Download, Delete, Regenerate
// Pagination and search
```

### Page: `app/account/voice-synthesis/page.tsx`
- Main TTS interface
- Requires authentication
- Shows user's voice profiles
- Integrates TextToSpeech and SynthesisHistory components

## 5. Implementation Steps

### Phase 1: Core TTS Functionality
1. **Create database migration** for `synthesized_audio` table
2. **Implement MiniMaxTTS service** in `lib/services/minimax-tts.ts`
3. **Create synthesis API endpoint** at `/api/voice/synthesize/route.ts`
4. **Build basic UI** - TextToSpeech component
5. **Add audio playback** capability

### Phase 2: User Experience
1. **Add synthesis history** API and UI
2. **Implement caching** based on text hash
3. **Add advanced voice settings** (speed, pitch, emotion)
4. **Create cost tracking** and usage limits
5. **Add download functionality**

### Phase 3: Advanced Features
1. **Text preprocessing** (SSML support, pause insertion)
2. **Batch synthesis** for long texts
3. **Real-time streaming** for immediate playback
4. **Integration with memory creation**

## 6. Critical Files to Reference

### Existing Codebase
- `/lib/services/minimax.ts` - Base MiniMax integration pattern
- `/lib/utils/supabase-upload.ts` - Direct file upload utility
- `/components/voice/VoiceTrainingModal.tsx` - Voice profile UI patterns
- `/app/api/voice/profiles/route.ts` - Voice profile API patterns
- `/app/api/voice/clone/initiate/route.ts` - Existing MiniMax API usage

### Environment Variables (Already Set)
```env
MINIMAX_API_KEY=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
MINIMAX_API_HOST=https://api.minimaxi.chat
MINIMAX_GROUP_ID=1942805167665582118
```

### Current Voice Profiles Schema
```sql
-- Reference: voice_profiles table structure
id UUID PRIMARY KEY
user_id UUID REFERENCES auth.users(id)
name VARCHAR(100) NOT NULL
minimax_voice_id VARCHAR(100) -- Use this for TTS
training_status VARCHAR(20) -- Only use 'completed' profiles
model_type VARCHAR(50) -- speech-02-hd or speech-02-turbo
created_at TIMESTAMP
```

## 7. Error Handling & Edge Cases

### MiniMax API Errors
- Authentication failures (401/403)
- Rate limiting (429)
- Invalid voice_id
- Text too long (>5000 chars)
- Invalid characters in text

### User Experience
- No voice profiles available
- Insufficient credits/usage limits
- Network failures
- Large file uploads

## 8. Testing Checklist

### Functionality
- [ ] Text synthesis with different models
- [ ] Voice settings (speed, pitch, volume) work
- [ ] Different audio formats
- [ ] Text with pause markers `<#2.5#>`
- [ ] Long text handling
- [ ] Caching works correctly

### UI/UX
- [ ] Character counter updates
- [ ] Voice profile selection
- [ ] Audio playback controls
- [ ] Download functionality
- [ ] History pagination
- [ ] Error states display

### Performance
- [ ] Response times acceptable
- [ ] File storage efficient
- [ ] Database queries optimized
- [ ] Caching reduces duplicate requests

## 9. Cost & Rate Limiting

### Implementation Notes
- Track character usage per user
- Estimate costs before synthesis
- Set monthly limits (e.g., 10,000 characters)
- Show usage dashboard
- Cache results for identical text+voice combinations

### Pricing Estimation
```typescript
// Rough estimate based on MiniMax pricing
function estimateCost(characters: number): number {
  // Assume ~$0.02 per 1000 characters
  return (characters / 1000) * 0.02
}
```

## 10. Security Considerations

### Input Validation
- Sanitize text input
- Validate character limits
- Check voice profile ownership
- Rate limit per user

### Storage Security
- Use Supabase RLS policies
- Store files in user-specific folders
- Generate signed URLs for playback
- Implement file cleanup for old syntheses

## 11. Next Steps for Implementation

1. **Start with database migration** - Add synthesized_audio table
2. **Create MiniMaxTTS service** - Handle API communication
3. **Build synthesis API endpoint** - Process requests and store results
4. **Create basic UI** - Text input and voice selection
5. **Add playback functionality** - Stream audio from Supabase
6. **Implement history** - Show previous generations
7. **Add advanced features** - Settings, caching, cost tracking

## 12. Success Metrics

- Users can generate speech from text using their voice profiles
- Audio quality is acceptable for voice preservation
- Response times are under 30 seconds for typical requests
- Users can access their synthesis history
- Cost tracking prevents unexpected charges
- Error rates are below 5%

---

**Note**: This plan assumes voice cloning is already working (✅ confirmed). The TTS feature will leverage existing voice profiles to generate new speech content.