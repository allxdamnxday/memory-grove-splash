# Updated Supabase Email Templates

## Important: Use the Callback Route

Update your email templates in the Supabase Dashboard to use `/auth/callback` instead of `/auth/confirm` for better session handling.

### 1. Confirm Signup Template

**Subject:** Welcome to Memory Grove - Confirm Your Email

**Message:**
```html
<h2>Welcome to Memory Grove</h2>
<p>Thank you for beginning your journey with us. Your digital sanctuary awaits.</p>
<p>Please confirm your email address by clicking the link below:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email">Confirm your email</a></p>
<p>This link will expire in 24 hours.</p>
<p>If you didn't create an account with Memory Grove, you can safely ignore this email.</p>
<p>With gratitude,<br>The Memory Grove Team</p>
```

### 2. Magic Link Template

**Subject:** Your Memory Grove Sign-in Link

**Message:**
```html
<h2>Sign in to Memory Grove</h2>
<p>Click the link below to sign in to your Memory Grove account:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink">Sign in to Memory Grove</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this link, you can safely ignore this email.</p>
<p>With care,<br>The Memory Grove Team</p>
```

### 3. Reset Password Template

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

### 4. Change Email Address Template

**Subject:** Confirm Your New Email Address - Memory Grove

**Message:**
```html
<h2>Confirm Email Change</h2>
<p>You requested to change your email address for Memory Grove.</p>
<p>Please confirm your new email address by clicking the link below:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email_change">Confirm new email</a></p>
<p>This link will expire in 24 hours.</p>
<p>If you didn't request this change, please secure your account immediately.</p>
<p>With care,<br>The Memory Grove Team</p>
```

### 5. Invite User Template

**Subject:** You're Invited to Memory Grove

**Message:**
```html
<h2>You're Invited to Memory Grove</h2>
<p>Someone special has invited you to create your own Memory Grove - a sacred digital space for preserving your voice and stories.</p>
<p>Click the link below to accept your invitation:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=invite">Accept invitation</a></p>
<p>This invitation will expire in 7 days.</p>
<p>With warmth,<br>The Memory Grove Team</p>
```

## Key Changes

1. **Using `/auth/callback`** instead of `/auth/confirm` - This route handles both OAuth and email confirmations properly
2. **Consistent session handling** - The callback route ensures sessions are properly established
3. **Better error handling** - Redirects to appropriate error pages with context

## Testing After Update

1. Clear your browser cookies/cache
2. Try signing up with a new email
3. Check the server logs with `npm run dev` to see the debugging output
4. Verify the email link uses `/auth/callback`
5. Click the confirmation link and verify you're logged in