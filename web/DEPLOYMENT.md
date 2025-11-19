# ChangelogAI Pro Deployment Guide

This guide walks you through deploying ChangelogAI Pro to production.

## Prerequisites

- [Vercel Account](https://vercel.com)
- [Supabase Account](https://supabase.com)
- [GitHub OAuth App](https://github.com/settings/developers)
- [Anthropic API Key](https://console.anthropic.com)
- [Stripe Account](https://stripe.com)
- [Resend Account](https://resend.com)
- [PostHog Account](https://posthog.com) (optional)

## 1. Supabase Setup (Database & Auth)

### Create Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Name: `changelogai-pro`
4. Set a strong database password
5. Select region closest to your users

### Run Database Migrations

Execute these SQL commands in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  github_username TEXT,
  subscription_tier TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Repositories table
CREATE TABLE public.repositories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  github_repo_id BIGINT,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  owner TEXT NOT NULL,
  default_branch TEXT DEFAULT 'main',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Changelogs table
CREATE TABLE public.changelogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  repository_id UUID REFERENCES public.repositories(id) ON DELETE CASCADE,
  version TEXT,
  from_ref TEXT,
  to_ref TEXT,
  content JSONB,
  markdown_content TEXT,
  ai_enhanced BOOLEAN DEFAULT false,
  format TEXT DEFAULT 'markdown',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral codes table
CREATE TABLE public.referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  uses INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  reward_granted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage analytics table
CREATE TABLE public.usage_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_repositories_user_id ON public.repositories(user_id);
CREATE INDEX idx_changelogs_user_id ON public.changelogs(user_id);
CREATE INDEX idx_changelogs_repository_id ON public.changelogs(repository_id);
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_usage_events_user_id ON public.usage_events(user_id);
CREATE INDEX idx_usage_events_created_at ON public.usage_events(created_at);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changelogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own repositories" ON public.repositories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own repositories" ON public.repositories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own repositories" ON public.repositories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own repositories" ON public.repositories FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own changelogs" ON public.changelogs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own changelogs" ON public.changelogs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own changelogs" ON public.changelogs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own changelogs" ON public.changelogs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own referral codes" ON public.referral_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can insert own usage events" ON public.usage_events FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Get Supabase Credentials

1. Go to Project Settings > API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

## 2. GitHub OAuth Setup

### Create OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `ChangelogAI Pro`
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`
4. Click "Register application"
5. Copy Client ID → `GITHUB_CLIENT_ID`
6. Generate new client secret → `GITHUB_CLIENT_SECRET`

### Configure Supabase Auth

1. In Supabase Dashboard: Authentication > Providers
2. Enable GitHub provider
3. Enter GitHub Client ID and Secret
4. Save

## 3. Anthropic API (AI Features)

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Create API key
3. Copy key → `ANTHROPIC_API_KEY`

## 4. Stripe Payment Setup

### Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to Test mode for development

### Create Products

1. Products > Add Product
2. Create two products:

**ChangelogAI Pro**
- Name: `ChangelogAI Pro`
- Price: `$9/month`
- Billing period: Monthly
- Copy Price ID → `STRIPE_PRO_PRICE_ID`

**ChangelogAI Team**
- Name: `ChangelogAI Team`
- Price: `$29/month`
- Billing period: Monthly
- Copy Price ID → `STRIPE_TEAM_PRICE_ID`

### Get Stripe Keys

1. Developers > API keys
2. Copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

### Setup Webhook

1. Developers > Webhooks > Add endpoint
2. Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
3. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy Signing secret → `STRIPE_WEBHOOK_SECRET`

## 5. Resend Email Setup

1. Go to [Resend Dashboard](https://resend.com)
2. Create API key
3. Copy key → `RESEND_API_KEY`
4. Add and verify your domain
5. Set `RESEND_FROM_EMAIL=notifications@yourdomain.com`

## 6. PostHog Analytics (Optional)

1. Go to [PostHog](https://app.posthog.com)
2. Create project
3. Copy:
   - Project API Key → `NEXT_PUBLIC_POSTHOG_KEY`
   - Host → `NEXT_PUBLIC_POSTHOG_HOST`

## 7. Deploy to Vercel

### Connect Repository

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Framework Preset: Next.js
6. Root Directory: `web`

### Configure Environment Variables

In Vercel project settings > Environment Variables, add all variables from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_TEAM_PRICE_ID=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=  # Generate with: openssl rand -base64 32
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your app at `https://your-app.vercel.app`

## 8. Post-Deployment Configuration

### Update Callback URLs

Update these URLs with your Vercel deployment URL:

1. **GitHub OAuth**: Update callback URL to `https://your-app.vercel.app/api/auth/callback/github`
2. **Stripe Webhook**: Update endpoint to `https://your-app.vercel.app/api/webhooks/stripe`
3. **Supabase Auth**: Add site URL in Authentication > URL Configuration

### Test the Application

1. ✅ Sign in with GitHub
2. ✅ Connect a repository
3. ✅ Generate a changelog
4. ✅ Try AI polish feature
5. ✅ Test Pro subscription flow
6. ✅ Verify webhook receives events
7. ✅ Check email notifications

## 9. Production Checklist

Before going live, complete the [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)

## Troubleshooting

### Build Errors

- Check all environment variables are set correctly
- Verify API keys are valid
- Check Vercel build logs

### Auth Issues

- Verify GitHub OAuth callback URL matches exactly
- Check Supabase Auth configuration
- Ensure NEXTAUTH_URL is correct

### Payment Issues

- Verify Stripe webhook secret is correct
- Check Stripe test/live mode matches keys
- Test webhook endpoint manually

### Email Issues

- Verify Resend API key
- Check domain is verified
- Test with Resend API directly

## Support

- Documentation: [docs.changelogai.com](https://docs.changelogai.com)
- GitHub Issues: [github.com/yourusername/ai-changelog-generator/issues](https://github.com/yourusername/ai-changelog-generator/issues)
- Email: support@changelogai.com
