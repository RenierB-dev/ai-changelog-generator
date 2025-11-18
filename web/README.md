# Changelog Premium - Web Dashboard

Beautiful, AI-powered web interface for the Changelog Generator.

## Features

- 🎨 **Modern UI** - Next.js + TypeScript + Tailwind CSS
- 🌙 **Dark Mode** - System-aware theme switching
- 🤖 **AI Polish** - Rewrite, summarize, and enhance changelogs
- 📊 **Visual Timeline** - Interactive release history
- 🔍 **Search & Filter** - Find commits instantly
- 📄 **PDF Export** - Branded changelog exports
- 🔗 **Integrations** - Slack, Email, GitHub
- 🎨 **Templates** - Tech, SaaS, Open Source styles
- 💎 **Pricing Tiers** - Free, Pro, Team plans

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## Environment Setup

### Required

```env
# Anthropic AI (for AI polish features)
ANTHROPIC_API_KEY=your_key_here

# Supabase (for auth and database)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Optional

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# Stripe (for payments)
STRIPE_PUBLIC_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

## Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the SQL in `supabase-schema.sql`
3. Add Supabase credentials to `.env.local`

## Project Structure

```
web/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── changelog/     # Changelog generation
│   │   ├── ai/            # AI polish features
│   │   ├── templates/     # Template management
│   │   ├── integrations/  # Slack, email, etc.
│   │   └── export/        # PDF export
│   ├── dashboard/         # Dashboard pages
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── dashboard-layout.tsx
│   ├── changelog-viewer.tsx
│   ├── changelog-timeline.tsx
│   ├── ai-polish-panel.tsx
│   └── theme-provider.tsx
├── lib/                   # Utilities
│   ├── supabase.ts       # Supabase client
│   ├── pricing.ts        # Pricing logic
│   ├── pdf-export.ts     # PDF generation
│   └── utils.ts          # Helper functions
├── public/               # Static files
│   └── widget.js         # Embeddable widget
└── package.json          # Dependencies
```

## API Routes

### Changelog Generation
```typescript
POST /api/changelog/generate
{
  "repoPath": "/path/to/repo",
  "fromTag": "v1.0.0",
  "toTag": "v2.0.0",
  "useAI": true
}
```

### AI Polish
```typescript
POST /api/ai/polish
{
  "type": "rewrite" | "group" | "summary" | "highlights" | "tweet",
  "commits": [...]
}
```

### Templates
```typescript
GET /api/templates              # List templates
POST /api/templates             # Apply template
{
  "templateId": "tech",
  "data": { "version": "v1.0.0", ... }
}
```

### Integrations
```typescript
POST /api/integrations/slack
POST /api/integrations/email
```

### Export
```typescript
POST /api/export/pdf
{
  "changelog": {...},
  "version": "v1.0.0",
  "branding": {...}
}
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build
docker build -t changelog-web .

# Run
docker run -p 3000:3000 changelog-web
```

### Environment Variables

Set these in your deployment platform:
- Vercel: Project Settings → Environment Variables
- Docker: Use `.env` file or `-e` flags

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Database**: Supabase
- **AI**: Anthropic Claude
- **Payments**: Stripe (optional)

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build
npm run build

# Start production server
npm start
```

## License

MIT - see LICENSE file
