# Supabase Email Template Configuration

Follow these steps to configure email templates in your Supabase dashboard for the Memory Grove authentication system.

## 1. Access Email Templates

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**

## 2. Update Email Templates

### Confirm Signup Template

Replace the default template with:

**Subject:** Welcome to Memory Grove - Confirm Your Email

**Body:**
```html
<h2>Welcome to Memory Grove</h2>
<p>Thank you for beginning your journey with us. Your digital sanctuary awaits.</p>
<p>Please confirm your email address by clicking the link below:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Confirm your email</a></p>
<p>This link will expire in 24 hours.</p>
<p>If you didn't create an account with Memory Grove, you can safely ignore this email.</p>
<p>With gratitude,<br>The Memory Grove Team</p>
```

### Reset Password Template

**Subject:** Reset Your Memory Grove Password

**Body:**
```html
<h2>Reset Your Password</h2>
<p>We received a request to reset your Memory Grove password.</p>
<p>Click the link below to create a new password:</p>
<p><a href="{{ .SiteURL }}/update-password?token_hash={{ .TokenHash }}&type=recovery">Reset your password</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request a password reset, you can safely ignore this email.</p>
<p>With care,<br>The Memory Grove Team</p>
```

### Magic Link Template (Optional)

**Subject:** Your Memory Grove Sign-in Link

**Body:**
```html
<h2>Sign in to Memory Grove</h2>
<p>Click the link below to sign in to your Memory Grove account:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink">Sign in to Memory Grove</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this link, you can safely ignore this email.</p>
<p>With care,<br>The Memory Grove Team</p>
```

## 3. Update Auth Settings

1. Go to **Authentication** → **URL Configuration**
2. Set the following URLs:

- **Site URL:** `https://your-domain.com` (or `http://localhost:3000` for development)
- **Redirect URLs:** 
  - `http://localhost:3000/**`
  - `https://your-domain.com/**`

## 4. Email Settings

1. Go to **Authentication** → **Email Settings**
2. Ensure the following are configured:
   - **Enable email confirmations:** ON
   - **Enable email change confirmations:** ON
   - **Secure email change:** ON

## 5. SMTP Configuration (Production)

For production, configure custom SMTP to ensure reliable email delivery:

1. Go to **Project Settings** → **SMTP Settings**
2. Configure with your email service provider (SendGrid, AWS SES, etc.)

## Important Notes

- The `{{ .SiteURL }}` variable will be replaced with your configured Site URL
- The `{{ .TokenHash }}` is the secure token for email verification
- All email templates support HTML formatting
- Test email delivery in development before going to production
- Consider adding your logo and brand colors to the email templates