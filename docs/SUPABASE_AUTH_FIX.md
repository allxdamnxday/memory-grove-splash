# Supabase Authentication Configuration Fix

This guide will help you fix the email confirmation flow for Memory Grove authentication.

## Issue Summary
The current issue is that Supabase is sending confirmation emails with URLs pointing to the Supabase domain (`https://frevvvzjxexzribqoqmq.supabase.co/auth/v1/verify`) instead of your application domain. This causes a 404 error when users click the confirmation link.

## Step 1: Update URL Configuration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Update the following settings:

   **Site URL:**
   - For development: `http://localhost:3000`
   - For production: `https://your-domain.com`

   **Redirect URLs (add all of these):**
   - `http://localhost:3000/**`
   - `http://localhost:3000/auth/confirm`
   - `http://localhost:3000/update-password`
   - `http://localhost:3000/account`
   - `https://your-domain.com/**` (for production)

5. Click "Save"

## Step 2: Update Email Templates

### Navigate to Email Templates
1. In your Supabase Dashboard, go to **Authentication** → **Email Templates**

### Update "Confirm signup" Template

Replace the entire template with:

**Subject:** Welcome to Memory Grove - Confirm Your Email

**Message:**
```html
<h2>Welcome to Memory Grove</h2>
<p>Thank you for beginning your journey with us. Your digital sanctuary awaits.</p>
<p>Please confirm your email address by clicking the link below:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Confirm your email</a></p>
<p>This link will expire in 24 hours.</p>
<p>If you didn't create an account with Memory Grove, you can safely ignore this email.</p>
<p>With gratitude,<br>The Memory Grove Team</p>
```

### Update "Magic Link" Template

**Subject:** Your Memory Grove Sign-in Link

**Message:**
```html
<h2>Sign in to Memory Grove</h2>
<p>Click the link below to sign in to your Memory Grove account:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink">Sign in to Memory Grove</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this link, you can safely ignore this email.</p>
<p>With care,<br>The Memory Grove Team</p>
```

### Update "Reset Password" Template

**Subject:** Reset Your Memory Grove Password

**Message:**
```html
<h2>Reset Your Password</h2>
<p>We received a request to reset your Memory Grove password.</p>
<p>Click the link below to create a new password:</p>
<p><a href="{{ .SiteURL }}/update-password?token_hash={{ .TokenHash }}&type=recovery">Reset your password</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request a password reset, you can safely ignore this email.</p>
<p>With care,<br>The Memory Grove Team</p>
```

### Update "Change Email Address" Template

**Subject:** Confirm Your New Email Address - Memory Grove

**Message:**
```html
<h2>Confirm Email Change</h2>
<p>You requested to change your email address for Memory Grove.</p>
<p>Please confirm your new email address by clicking the link below:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email_change">Confirm new email</a></p>
<p>This link will expire in 24 hours.</p>
<p>If you didn't request this change, please secure your account immediately.</p>
<p>With care,<br>The Memory Grove Team</p>
```

### Update "Invite User" Template (if using invites)

**Subject:** You're Invited to Memory Grove

**Message:**
```html
<h2>You're Invited to Memory Grove</h2>
<p>Someone special has invited you to create your own Memory Grove - a sacred digital space for preserving your voice and stories.</p>
<p>Click the link below to accept your invitation:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite">Accept invitation</a></p>
<p>This invitation will expire in 7 days.</p>
<p>With warmth,<br>The Memory Grove Team</p>
```

## Step 3: Email Settings Configuration

1. Stay in the Authentication section
2. Go to **Email Settings**
3. Ensure these settings are configured:
   - **Enable email confirmations:** ON
   - **Enable email change confirmations:** ON  
   - **Secure email change:** ON
   - **Enable sign-ups:** ON (unless you want invite-only)

## Step 4: Test the Configuration

1. **Test Signup Flow:**
   ```bash
   # Start your development server
   npm run dev
   ```
   - Go to http://localhost:3000/signup
   - Sign up with a real email address
   - Check your email for the confirmation link
   - Click the link and verify you're redirected to `/account`

2. **Test Password Reset:**
   - Go to http://localhost:3000/forgot-password
   - Enter your email
   - Check for the reset email
   - Click the link and verify you can set a new password

3. **Test Login:**
   - Go to http://localhost:3000/login
   - Login with your credentials
   - Verify you're redirected to `/account`

## Troubleshooting

### "Token has expired or is invalid" Error
This can happen if:
- The link was already used
- The link expired (24 hours for signup, 1 hour for password reset)
- Email prefetching consumed the link (some email providers do this)

**Solution:** Request a new link by signing up or requesting password reset again.

### Still Getting 404 Errors
Double-check that:
1. Site URL is correctly set to `http://localhost:3000` (no trailing slash)
2. Email templates are using `{{ .SiteURL }}` not `{{ .ConfirmationURL }}`
3. You saved all changes in the Supabase dashboard

### Users Can't Sign In After Signup
Ensure that:
1. Email confirmations are enabled in settings
2. The confirmation route (`/auth/confirm`) is working
3. Check Supabase logs for any errors

## Important Notes

- **For Production:** Remember to update the Site URL and redirect URLs to your production domain
- **Email Delivery:** In development, emails might go to spam. Check spam folder or consider using a service like [Mailpit](https://github.com/axllent/mailpit) for local email testing
- **SMTP Configuration:** For production, configure custom SMTP in Project Settings → SMTP Settings for better deliverability