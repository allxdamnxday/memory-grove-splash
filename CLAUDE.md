# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Memory Grove Splash is a completed, production-ready marketing website built with Next.js 14.2.3. It serves as the landing page for Memory Grove - a "sacred digital sanctuary" for preserving memories through voice, story, and connection. The project features a nature-inspired design with exceptional attention to user experience, accessibility, and performance.

## Essential Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Deployment
vercel               # Deploy to Vercel (requires Vercel CLI)
```

## Architecture and Key Technologies

### Core Stack
- **Framework**: Next.js 14.2.3 with App Router
- **Language**: TypeScript 5.4.5 (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (auth & data storage)
- **Forms**: react-hook-form with Zod validation
- **Email**: Resend API with React Email templates
- **Content**: MDX for blog posts with syntax highlighting
- **SEO**: next-seo with comprehensive metadata

### Project Structure
```
app/                      # App Router pages
├── (marketing)/         # Route group for marketing pages
│   ├── about/          # About page with team & mission
│   ├── blog/           # Blog listing and dynamic posts
│   └── contact/        # Contact form page
├── api/                # API routes
│   ├── contact/        # Contact form submission
│   └── subscribe/      # Newsletter subscription
├── layout.tsx          # Root layout with metadata
└── page.tsx           # Landing page with hero & features

components/             # React components
├── blog/              # BlogCard, BlogList
├── layout/            # Header, Footer, AnimationObserver
├── marketing/         # Hero, Features, CTA sections
└── ui/                # Button, Card, Input, LoadingSpinner

content/               # MDX content
└── blog/             # Blog posts in MDX format

lib/                   # Utilities and configurations
├── email/            # Email template placeholders
├── mdx/              # MDX processing utilities
├── supabase/         # Database client setup
└── utils.ts          # cn() helper for classNames

public/               # Static assets
└── images/          # Favicons, OG images
```

### High-Level Architecture Patterns

1. **Server Components First**: All components are Server Components by default. Client Components are marked with 'use client' only when needed for interactivity (forms, observers).

2. **Form Handling Pattern**: 
   - Zod schemas define validation rules (`lib/schemas/`)
   - react-hook-form manages form state
   - API routes handle submissions with proper error handling
   - Nature-inspired success/error messages maintain brand voice

3. **Blog System Architecture**:
   - MDX files in `content/blog/` contain posts
   - `lib/mdx/index.ts` handles MDX processing with frontmatter
   - Dynamic routing via `app/(marketing)/blog/[slug]/page.tsx`
   - Automatic metadata generation for SEO

4. **Database Integration**:
   - Supabase client created in `lib/supabase/client.ts`
   - Tables: contacts, subscribers (schema in Supabase dashboard)
   - Server-side operations use service role key

5. **Design System Implementation**:
   - Custom Tailwind config with brand colors (sage, warm neutrals)
   - Typography scale using Cormorant Garamond, Source Sans Pro
   - Consistent spacing system (4px to 96px)
   - Gentle animations (fade-in, scale-in, slide-up)

## Key Configuration Details

### Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

Optional analytics:
```
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

### Tailwind Configuration
The `tailwind.config.ts` contains a comprehensive design system:
- Brand colors mapped to semantic names
- Custom font families with fallbacks
- Extended spacing and shadow scales
- Custom animations for organic feel

### API Routes Pattern
All API routes follow consistent patterns:
- Validate request method
- Parse and validate body with Zod
- Handle database operations with try/catch
- Return consistent error responses
- Use nature-inspired messaging

## Development Guidelines

1. **Component Creation**: Check existing components for patterns. New components should follow the established structure and naming conventions.

2. **Styling Approach**: Use Tailwind utility classes with the `cn()` helper from `lib/utils.ts` for conditional classes.

3. **Error Handling**: Maintain the gentle, nature-inspired tone in all user-facing messages. See existing error messages for examples.

4. **Performance**: Images use Next.js Image component with proper sizing. Components lazy-load where appropriate.

5. **Accessibility**: All interactive elements have proper ARIA labels. Color contrast meets WCAG AA standards.

## Deployment

The project is configured for Vercel deployment with:
- `vercel.json` for optimal settings
- API route duration limits configured
- Security headers in place
- Proper redirect rules

Deploy with: `vercel` (requires Vercel CLI and linked project)