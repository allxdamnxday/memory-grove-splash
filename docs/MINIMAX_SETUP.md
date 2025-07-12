# MiniMax Voice Cloning Setup Guide

## Environment Variables Required

You need to add these three environment variables to your Vercel project:

### 1. MINIMAX_API_KEY
- **Description**: Your MiniMax API authentication token (JWT format)
- **Format**: A long JWT token starting with `eyJ...`
- **Example**: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...` (truncated)
- **Important**: Copy the entire token without any line breaks or extra spaces

### 2. MINIMAX_API_HOST
- **Description**: The MiniMax API base URL for voice cloning operations
- **Value**: `https://api.minimaxi.chat`
- **Important**: Must include `https://` and no trailing slash

### 2a. MINIMAX_TTS_API_HOST (Optional)
- **Description**: The MiniMax API base URL for text-to-speech (T2A v2) operations
- **Value**: `https://api.minimax.io`
- **Default**: Falls back to MINIMAX_API_HOST if not specified
- **Note**: Some regions may use different endpoints for TTS vs voice cloning

### 3. MINIMAX_GROUP_ID  
- **Description**: Your MiniMax group identifier
- **Format**: A numeric string (18-19 digits)
- **Example**: `194280516766558211`

## Adding to Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable:
   - Click "Add New"
   - Enter the Key (e.g., `MINIMAX_API_KEY`)
   - Paste the Value
   - Select environments (Production, Preview, Development)
   - Click "Save"

## Testing Your Configuration

After deploying with the new environment variables:

1. Visit: `https://your-domain.vercel.app/api/voice/test`
2. Check the JSON response for any failed checks
3. Look at Vercel function logs for detailed debugging info

## Common Issues

### "MINIMAX_API_KEY CAN NOT BE FOUND OR VERIFIED"
This error from the MiniMax API usually means:
- The API key is missing or incorrectly formatted
- The API key has expired (JWT tokens can expire)
- The API key was not copied completely

### Authentication Failed
- Double-check that the entire JWT token was copied
- Ensure no spaces or line breaks were added
- Verify the Group ID matches your MiniMax account

### Voice Synthesis (TTS) Not Working
- Check that MINIMAX_TTS_API_HOST is set to `https://api.minimax.io`
- If not set, the system will use MINIMAX_API_HOST which may not support TTS
- Different regions may require different endpoints

### Invalid JSON Response
- Check that MINIMAX_API_HOST is exactly `https://api.minimaxi.chat` for voice cloning
- Check that MINIMAX_TTS_API_HOST is exactly `https://api.minimax.io` for TTS
- Ensure your MiniMax account is active and has API access

## Debugging Steps

1. Check Vercel function logs for `[MiniMax]` prefixed messages
2. Use the test endpoint to verify configuration
3. Look for specific error codes in the logs:
   - `CONFIG_ERROR`: Missing environment variables
   - `AUTH_ERROR`: Invalid API key or permissions
   - `INVALID_RESPONSE`: API communication issues