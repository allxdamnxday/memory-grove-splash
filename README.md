# Memory Groves - Landing Page

A sacred digital sanctuary where memories bloom eternal. This is the marketing splash site for Memory Groves, built with Next.js 14 and designed with care to honor the importance of preserving memories.

## 🌿 Project Overview

Memory Groves helps people preserve their essence through voice, story, and connection. This landing page introduces visitors to our mission and allows them to join our growing community.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## 📋 Deployment to Vercel

### Prerequisites

1. A Vercel account
2. A Supabase account (for database)
3. (Optional) A Resend account for email functionality

### Step 1: Deploy to Vercel

1. Push your code to GitHub (already done)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository: `memory-grove-splash`
5. Click "Deploy"

### Step 2: Configure Environment Variables

In your Vercel project settings, add the following environment variables:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site URL (Required)
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app

# Email Service (Optional)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=hello@yourdomain.com
RESEND_AUDIENCE_ID=your_resend_audience_id

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

### Step 3: Set Up Supabase Database

1. Create a new Supabase project
2. Go to SQL Editor and run the following:

```sql
-- Create subscribers table
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'landing_page'
);

-- Create contact submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers
CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create policies for contact submissions
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);
```

### Step 4: Configure Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow Vercel's instructions to update DNS records
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

## 🎨 Design Assets

Before going live, replace placeholder images in `/public/images/`:

- `favicon.ico` - Browser tab icon (32x32)
- `favicon-16x16.png` - Small favicon (16x16)
- `apple-touch-icon.png` - Apple devices icon (180x180)
- `og-image.jpg` - Open Graph sharing image (1200x630)
- `twitter-image.jpg` - Twitter card image (1200x600)

## 🔧 Configuration Files

- `vercel.json` - Vercel deployment configuration
- `.env.example` - Environment variable template
- `tailwind.config.ts` - Brand colors and typography
- `next.config.mjs` - Next.js configuration

## 📊 Performance Checklist

- [ ] Replace placeholder images with optimized versions
- [ ] Test all forms (email capture, contact)
- [ ] Verify mobile responsiveness
- [ ] Check accessibility with screen reader
- [ ] Run Lighthouse audit (target 95+ score)
- [ ] Test on multiple browsers

## 🌱 Brand Guidelines

Memory Groves follows these design principles:

- **Colors**: Sage greens and warm neutrals
- **Typography**: Cormorant Garamond (headings), Source Sans Pro (body)
- **Tone**: Sacred, gentle, reverent
- **Animations**: Minimum 300ms, gentle transitions
- **Language**: Nature metaphors throughout

## 📝 Content Management

Blog posts are written in MDX format in `/content/blog/`. To add a new post:

1. Create a new `.mdx` file in `/content/blog/`
2. Include frontmatter with title, date, excerpt, author, and tags
3. Write content using Markdown with optional React components

## 🛠️ Development

```bash
# Run linting
npm run lint

# Type checking
npm run typecheck

# Format code
npm run format
```

## 📄 License

© 2025 Memory Groves. All rights reserved.

---

Built with love to honor memories that deserve to bloom eternal 🌿