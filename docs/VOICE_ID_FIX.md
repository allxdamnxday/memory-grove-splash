# Voice ID Format Fix

## Issue
The MiniMax API was rejecting voice IDs with the error: "Voice ID must be at least 8 characters and start with a letter"

## Root Cause
The voice ID generation was creating IDs in the format: `mg_${userId}_${timestamp}`
- Example: `mg_12345678_1234567890123`

This format violated MiniMax's requirements:
- Must start with a letter (not "mg_")
- Must contain only alphanumeric characters (no underscores)
- Must be at least 8 characters long

## Solution
Updated the voice ID generation to: `voice${timestamp36}${randomSuffix}`
- Example: `voicelk3m9x8abc123`
- Starts with "voice" (letters)
- Contains only alphanumeric characters
- Always 15+ characters long

## Code Changes
File: `/app/api/voice/profiles/route.ts`
```typescript
// Old format:
const voiceId = `mg_${user.id.substring(0, 8)}_${Date.now()}`

// New format:
const timestamp = Date.now().toString(36)
const randomSuffix = Math.random().toString(36).substring(2, 8)
const voiceId = `voice${timestamp}${randomSuffix}`
```

## Migration Note
If there are existing voice profiles with the old format, they will need to be updated. Since the app is newly deployed, this shouldn't be an issue. Any profiles created before this fix will need to be recreated.