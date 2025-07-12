# Client-Side Audio Conversion Implementation

## Overview

We've migrated from server-side audio conversion (which was causing Vercel deployment issues due to ffmpeg binary dependencies) to client-side conversion using the `lamejs` library.

## Why Client-Side Conversion?

1. **Vercel Compatibility**: No binary dependencies, works in serverless environment
2. **Better Performance**: Conversion happens while user reviews recording
3. **Reduced Server Load**: Audio processing happens in the browser
4. **Cost Effective**: No server compute time for conversion
5. **Immediate Feedback**: Users see conversion progress in real-time

## How It Works

### 1. Recording Flow
- User records audio using browser's MediaRecorder API
- Audio is captured in WebM (Chrome/Edge) or OGG (Firefox) format
- When user clicks "Save Recording", conversion begins

### 2. Conversion Process
```typescript
// In AudioRecorder component
if (!isMiniMaxCompatible(audioBlob.type)) {
  // Convert to MP3 with voice-optimized settings
  const mp3Blob = await convertForVoicePreservation(
    audioBlob,
    'standard', // 128kbps, 44.1kHz, mono
    (progress) => setConversionProgress(progress)
  )
}
```

### 3. Voice-Optimized Presets
```typescript
export const VOICE_PRESETS = {
  high: {
    bitrate: 192,      // High quality for archival
    sampleRate: 44100,
    channels: 1        // Mono for voice
  },
  standard: {
    bitrate: 128,      // Good balance of quality/size
    sampleRate: 44100,
    channels: 1
  },
  efficient: {
    bitrate: 96,       // Smaller files, still good for voice
    sampleRate: 22050,
    channels: 1
  }
}
```

### 4. Conversion Steps
1. Decode WebM/OGG using Web Audio API
2. Extract audio samples as Float32Array
3. Convert stereo to mono (if needed)
4. Resample to target sample rate (if needed)
5. Convert Float32 samples to Int16 for MP3 encoder
6. Encode to MP3 using lamejs
7. Return MP3 blob

## User Experience

1. **Visual Feedback**: Progress bar shows conversion percentage
2. **Button States**: Save button shows "Converting..." with spinner
3. **Error Handling**: Alert shown if conversion fails
4. **No Interruption**: User can still replay recording during conversion

## Technical Benefits

### Before (Server-Side FFmpeg)
- Required `@ffmpeg-installer/ffmpeg` (68MB binary)
- Failed on Vercel due to missing platform-specific modules
- Added latency for server round-trip
- Increased server costs

### After (Client-Side LameJS)
- Pure JavaScript implementation
- Works in all modern browsers
- No server dependencies
- Instant deployment on Vercel

## API Changes

The voice cloning API now expects pre-converted audio:
```typescript
// In /api/voice/clone/initiate/route.ts
const supportedFormats = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/x-m4a', 'audio/mp4']
if (!supportedFormats.includes(memory.file_type)) {
  throw new Error(`Unsupported audio format: ${memory.file_type}. Please upload MP3, WAV, or M4A files.`)
}
```

## Browser Compatibility

- **Chrome/Edge**: WebM → MP3 ✓
- **Firefox**: OGG → MP3 ✓
- **Safari**: MP4/M4A (no conversion needed) ✓
- **Mobile**: All major mobile browsers supported ✓

## Future Enhancements

1. **Web Workers**: Move conversion to background thread for better performance
2. **Quality Selection**: Let users choose conversion quality
3. **Batch Processing**: Convert multiple recordings at once
4. **Format Options**: Support WAV output for maximum quality
5. **Audio Enhancement**: Add noise reduction, normalization

## Testing

To test the conversion:
1. Record audio using the AudioRecorder
2. Click "Save Recording"
3. Watch the conversion progress bar
4. Verify the uploaded file is MP3 format
5. Test voice cloning with the converted audio

## Monitoring

Track these metrics:
- Conversion success rate
- Average conversion time by file size
- Browser-specific issues
- User drop-off during conversion