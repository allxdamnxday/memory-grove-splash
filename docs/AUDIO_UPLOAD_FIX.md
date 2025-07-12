# Audio Conversion and Upload Fixes

## Issues Fixed

### 1. Audio Conversion Error: "MPEGMode is not defined"

**Problem**: The `lamejs` v1.2.1 package has a bug where MPEGMode is not properly imported in the module system, causing runtime errors in production builds.

**Solution**: Replaced `lamejs` with `@breezystack/lamejs` - a maintained fork that fixes this issue.

```bash
npm uninstall lamejs
npm install @breezystack/lamejs
```

Updated import in `lib/utils/audio-converter.ts`:
```typescript
import lamejs from '@breezystack/lamejs'
```

### 2. Upload Size Limit: "413 Content Too Large"

**Problem**: Vercel serverless functions have a 4.5MB request body limit, but audio files can be much larger (up to 50MB).

**Solution**: Implemented direct client-to-Supabase uploads, bypassing the API entirely for file data.

## New Upload Flow

### Before (Problematic)
1. Client records/selects audio
2. Client sends file to API (via POST /api/memories/upload)
3. API uploads to Supabase Storage ❌ Fails if >4.5MB
4. API saves metadata to database

### After (Fixed)
1. Client records/selects audio
2. Client converts WebM to MP3 (if needed)
3. **Client uploads directly to Supabase Storage** ✅
4. Client sends only metadata to API
5. API validates and saves metadata

## Implementation Details

### 1. Direct Upload Utility (`lib/utils/supabase-upload.ts`)
```typescript
export async function uploadMemoryAudio(
  audioFile: File | Blob,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult>
```

Features:
- Validates file size (50MB max)
- Validates file type
- Generates unique filenames
- Returns upload path and URL

### 2. Updated CreateMemory Component
- Uses `uploadMemoryAudio()` for direct uploads
- Shows upload progress
- Handles cleanup if metadata save fails

### 3. Updated API Route
- Now accepts JSON body (not FormData)
- Only handles metadata
- Validates that file exists in storage
- No longer handles file uploads

## Benefits

1. **No Size Limits**: Can upload files up to 50MB (Supabase limit)
2. **Better Performance**: Direct upload is faster
3. **Cost Savings**: Reduces serverless function compute time
4. **Better UX**: Real upload progress tracking
5. **Reliability**: No timeout issues for large files

## Testing Checklist

- [ ] Audio conversion works in all browsers
- [ ] Can upload files >4.5MB without errors
- [ ] Upload progress shows correctly
- [ ] Metadata saves properly
- [ ] Voice cloning works with uploaded files
- [ ] Error handling works (network issues, etc.)

## Environment Variables

No new environment variables required. Uses existing Supabase configuration.

## Security Considerations

1. **Authentication**: User must be authenticated to upload
2. **Storage Policies**: Supabase RLS policies control access
3. **File Validation**: Type and size validation on client and server
4. **User Isolation**: Files stored in user-specific folders

## Monitoring

Track these metrics:
- Upload success rate
- Average file sizes
- Conversion success rate
- API error rates

## Rollback Plan

If issues arise:
1. Revert to previous commit
2. Set MAX_FILE_SIZE to 4MB in code (temporary)
3. Users limited to smaller files until fix deployed