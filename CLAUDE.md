# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Memory Grove Splash is a Next.js 14.2.3 application using TypeScript and the App Router architecture. The project appears to be a landing page for Memory Grove with content management, authentication, and email capabilities.

## Essential Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture and Key Technologies

### Core Stack
- **Framework**: Next.js 14.2.3 with App Router
- **Language**: TypeScript 5.4.5
- **Styling**: Tailwind CSS with forms and typography plugins
- **Database/Auth**: Supabase (configured with environment variables)
- **Forms**: react-hook-form with Zod validation
- **Email**: Resend (API key needs configuration)
- **Content**: MDX support with syntax highlighting

### Project Structure
```
app/              # App Router pages and layouts
├── layout.tsx    # Root layout
├── page.tsx      # Home page (currently default starter)
└── globals.css   # Global styles with Tailwind directives

public/           # Static assets
```

### Configuration Files
- `tsconfig.json`: Strict mode enabled, `@/*` path alias configured
- `tailwind.config.ts`: Configured for app/, pages/, components/ directories
- `.env`: Contains Supabase credentials (not committed)

## Important Notes

1. **Fresh Setup**: This is a newly initialized Next.js project with additional dependencies installed but not yet implemented.

2. **Environment Variables**: The following are configured in `.env`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`

3. **No Test Framework**: Currently no testing setup. Consider Jest + React Testing Library if needed.

4. **Prettier**: Installed with Tailwind plugin but no config file (using defaults).

5. **TypeScript Path Alias**: Use `@/` to import from the project root.

## Development Patterns

When implementing features:
1. Use Server Components by default (Next.js App Router pattern)
2. Client Components only when needed (add 'use client' directive)
3. Supabase client should use SSR-compatible methods from `@supabase/ssr`
4. Form validation should use Zod schemas with react-hook-form
5. MDX content can be placed in a `content/` directory (to be created)