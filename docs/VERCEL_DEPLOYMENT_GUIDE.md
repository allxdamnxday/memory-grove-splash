# Vercel Deployment Guide for Memory Grove

This guide covers the complete setup process for deploying Memory Grove to Vercel with full authentication and audio recording functionality.

## Prerequisites

1. A Vercel account with your project deployed
2. A Supabase project with database and authentication configured
3. A Resend account for email sending (optional but recommended)

## Step 1: Configure Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add:

### Required Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Your deployed site URL (update this to match your Vercel URL)
NEXT_PUBLIC_SITE_URL=https://memory-grove-splash.vercel.app

# Email Service (Resend)
RESEND_API_KEY=re_your_resend_api_key

# Optional: Service role key (only if needed for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Optional Analytics Variables

```bash
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
```

## Step 2: Configure Supabase for Production

### 2.1 Update URL Configuration

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set the following:

**Site URL:**
```
https://memory-grove-splash.vercel.app
```

**Redirect URLs:** (Add both)
```
https://memory-grove-splash.vercel.app/**
http://localhost:3000/**
```

### 2.2 Update Email Templates

Go to Authentication → Email Templates and update each template:

#### Confirm Signup
- **Subject:** Welcome to Memory Grove - Confirm Your Email
- **Email Body:** Update `{{ .SiteURL }}` references to use your production URL
- **Callback URL:** `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`

#### Password Reset
- **Subject:** Reset Your Memory Grove Password
- **Email Body:** Update `{{ .SiteURL }}` references
- **Callback URL:** `{{ .SiteURL }}/update-password?token_hash={{ .TokenHash }}&type=recovery`

#### Magic Link (if enabled)
- **Subject:** Your Memory Grove Sign-in Link
- **Email Body:** Update `{{ .SiteURL }}` references
- **Callback URL:** `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink`

### 2.3 Verify Storage Buckets

Ensure these storage buckets exist and have proper policies:

1. **voice-memories** bucket
   - Private bucket for audio files
   - RLS policies should be active

2. **avatars** bucket
   - Public bucket for profile images
   - RLS policies should be active

## Step 3: Verify vercel.json Configuration

The `vercel.json` file has been updated with:

✅ **Microphone permissions** for audio recording:
```json
"Permissions-Policy": "camera=(), microphone=(self), geolocation=()"
```

✅ **Function duration limits** for audio uploads:
```json
"app/api/memories/upload/route.ts": {
  "maxDuration": 30
},
"app/api/memories/route.ts": {
  "maxDuration": 10
}
```

## Step 4: Deploy to Vercel

1. Commit and push your changes:
```bash
git add .
git commit -m "Configure Vercel deployment settings"
git push
```

2. Vercel will automatically deploy your changes

## Step 5: Test Your Deployment

### Authentication Flow
1. Navigate to `https://memory-grove-splash.vercel.app/signup`
2. Create a new account
3. Check your email for the confirmation link
4. Click the link - it should redirect to your Vercel deployment
5. Log in and verify you can access `/account`

### Audio Recording
1. Navigate to `/account/memories/new`
2. Test the audio recording feature
3. Verify the microphone permission prompt appears
4. Record a test audio and save it
5. Check that it appears in `/account/memories`

## Troubleshooting

### Authentication Issues

**Problem:** Email confirmation links go to wrong domain
- **Solution:** Update Supabase Site URL and email templates

**Problem:** "AuthSessionMissingError" after email confirmation
- **Solution:** Ensure cookies are properly set - check middleware configuration

**Problem:** Can't access protected routes
- **Solution:** Verify environment variables are set correctly in Vercel

### Audio Recording Issues

**Problem:** Microphone permission denied automatically
- **Solution:** Ensure the site is served over HTTPS (Vercel does this automatically)

**Problem:** Audio upload fails
- **Solution:** Check Vercel function logs for errors, verify storage bucket policies

**Problem:** "File too large" errors
- **Solution:** Verify function maxDuration is set to 30 seconds for upload route

### General Issues

**Problem:** Environment variables not working
- **Solution:** Redeploy after adding variables, ensure no typos in variable names

**Problem:** CORS errors
- **Solution:** Check Supabase URL configuration includes your Vercel domain

## Security Checklist

- [ ] All environment variables are set in Vercel (not committed to code)
- [ ] Supabase RLS policies are enabled on all tables
- [ ] Storage bucket policies restrict access appropriately
- [ ] Email templates use secure token verification
- [ ] Site URL is correctly configured in both Vercel and Supabase

## Next Steps

1. Configure custom domain (optional)
2. Set up monitoring and error tracking
3. Configure backup strategies for user data
4. Consider implementing rate limiting for API routes

## Support

For issues specific to:
- **Vercel deployment:** Check Vercel logs and function logs
- **Supabase auth:** Review Supabase auth logs in the dashboard
- **Application errors:** Check browser console and network tab