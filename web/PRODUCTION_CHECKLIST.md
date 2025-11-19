# ChangelogAI Pro Production Launch Checklist

Complete this checklist before launching ChangelogAI Pro to production.

## Pre-Launch Checklist

### 1. Infrastructure Setup

#### Supabase (Database & Auth)
- [ ] Create production Supabase project
- [ ] Run all database migrations in `supabase/migrations/`
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Test RLS policies with different user roles
- [ ] Configure GitHub OAuth provider in Supabase Auth
- [ ] Set up database backups (automatic daily backups)
- [ ] Add production URL to allowed redirect URLs
- [ ] Test authentication flow end-to-end

**Verification**:
```sql
-- Run this to verify tables exist:
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

#### Vercel Deployment
- [ ] Connect GitHub repository to Vercel
- [ ] Set Root Directory to `web`
- [ ] Configure all environment variables (see `.env.example`)
- [ ] Set up custom domain (if applicable)
- [ ] Enable automatic deployments from main branch
- [ ] Test build and deployment process
- [ ] Verify HTTPS is working

**Environment Variables Required**:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
NEXTAUTH_URL
NEXTAUTH_SECRET
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
CRON_SECRET
```

### 2. GitHub OAuth Configuration

- [ ] Create GitHub OAuth App
  - Application name: `ChangelogAI Pro`
  - Homepage URL: `https://your-domain.com`
  - Callback URL: `https://your-domain.com/api/auth/callback/github`
- [ ] Copy Client ID and Secret to Vercel environment variables
- [ ] Add OAuth app to Supabase Auth providers
- [ ] Test OAuth flow with test account
- [ ] Verify user profile creation on signup

### 3. Anthropic API (AI Features)

- [ ] Create Anthropic API key (production tier recommended)
- [ ] Add API key to Vercel environment variables
- [ ] Set rate limits and usage monitoring
- [ ] Test AI changelog polish feature
- [ ] Implement error handling for API failures
- [ ] Add graceful fallback to non-AI mode

**Test Command**:
```bash
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-sonnet-20240229","max_tokens":1024,"messages":[{"role":"user","content":"Hello"}]}'
```

### 4. Stripe Payment Processing

#### Stripe Account Setup
- [ ] Create/verify Stripe production account
- [ ] Complete business verification
- [ ] Set up bank account for payouts

#### Products & Pricing
- [ ] Create Pro product ($9/month)
  - Name: `ChangelogAI Pro`
  - Features: Unlimited changelogs, AI polish, PDF export
- [ ] Create Team product ($29/month)
  - Name: `ChangelogAI Team`
  - Features: All Pro features + team collaboration
- [ ] Copy Price IDs to environment variables
- [ ] Test checkout flow in test mode
- [ ] Switch to production mode

#### Webhooks
- [ ] Create webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
- [ ] Select events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- [ ] Copy webhook secret to environment variables
- [ ] Test webhook with Stripe CLI:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```
- [ ] Verify subscription creation/cancellation flow

### 5. Email Service (Resend)

- [ ] Create Resend account
- [ ] Add and verify custom domain
- [ ] Create API key
- [ ] Add API key to environment variables
- [ ] Test email templates:
  - [ ] Welcome email
  - [ ] Changelog ready notification
  - [ ] Weekly digest
  - [ ] Upgrade prompt
  - [ ] GitHub Action setup guide
- [ ] Configure SPF/DKIM/DMARC records for domain
- [ ] Test deliverability to Gmail, Outlook, etc.
- [ ] Set up email analytics/tracking

**Test Email**:
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from":"test@yourdomain.com","to":"you@example.com","subject":"Test","html":"<p>Test email</p>"}'
```

### 6. Analytics (PostHog)

- [ ] Create PostHog account
- [ ] Create production project
- [ ] Copy Project API Key and Host to environment variables
- [ ] Implement event tracking:
  - [ ] user_signed_up
  - [ ] repo_connected
  - [ ] changelog_generated
  - [ ] ai_polish_used
  - [ ] pdf_exported
  - [ ] upgrade_to_pro
- [ ] Set up conversion funnels
- [ ] Create dashboards for key metrics
- [ ] Test event capture in production

### 7. Scheduled Jobs (Vercel Cron)

- [ ] Configure weekly digest cron job
  - Schedule: `0 9 * * 1` (Every Monday at 9 AM)
  - Path: `/api/emails/digest`
- [ ] Generate and add CRON_SECRET to environment variables
- [ ] Test cron endpoint manually
- [ ] Verify weekly digest emails are sent

### 8. Security & Performance

#### Security
- [ ] Enable HTTPS only (disable HTTP)
- [ ] Configure CORS headers properly
- [ ] Add rate limiting to API routes
- [ ] Implement CSRF protection
- [ ] Sanitize user inputs
- [ ] Validate file uploads
- [ ] Secure API keys (use environment variables, never commit)
- [ ] Enable 2FA for all admin accounts
- [ ] Review and test RLS policies
- [ ] Add CSP headers
- [ ] Configure helmet.js or equivalent

#### Performance
- [ ] Enable Vercel Edge caching
- [ ] Optimize images (use Next.js Image component)
- [ ] Implement lazy loading for components
- [ ] Add database indexes (already in migrations)
- [ ] Test site speed with Lighthouse (target: 90+ score)
- [ ] Enable compression (gzip/brotli)
- [ ] Implement CDN for static assets

### 9. Legal & Compliance

- [ ] Create Privacy Policy page (`/privacy`)
  - Data collection practices
  - Cookie usage
  - Third-party services (Supabase, Stripe, Resend, PostHog)
  - User rights (GDPR compliance)
- [ ] Create Terms of Service page (`/terms`)
  - Service description
  - User obligations
  - Payment terms
  - Cancellation policy
  - Limitation of liability
- [ ] Add Cookie consent banner (if in EU)
- [ ] GDPR compliance:
  - [ ] User data export functionality
  - [ ] User data deletion functionality
  - [ ] Privacy policy disclosure
- [ ] Add links to Privacy & Terms in footer

### 10. Testing

#### Functionality Tests
- [ ] User signup flow (GitHub OAuth)
- [ ] Repository connection
- [ ] Changelog generation (free tier)
- [ ] Changelog generation (with AI - Pro tier)
- [ ] Export formats (Markdown, JSON, PDF)
- [ ] Subscription upgrade flow
- [ ] Subscription cancellation flow
- [ ] Referral code generation and tracking
- [ ] Email notifications
- [ ] Admin dashboard access and data
- [ ] Onboarding tour

#### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

#### Performance Testing
- [ ] Load testing (simulate 100+ concurrent users)
- [ ] Database query performance
- [ ] API response times (<200ms target)
- [ ] Page load times (<2s target)

### 11. Monitoring & Alerts

- [ ] Set up error monitoring (Sentry or similar)
- [ ] Configure uptime monitoring (UptimeRobot or similar)
- [ ] Set up Slack/email alerts for:
  - [ ] Server errors (500s)
  - [ ] High error rates
  - [ ] Downtime
  - [ ] Failed payments
  - [ ] Low AI API credits
- [ ] Create status page (status.changelogai.com)
- [ ] Set up log aggregation (Vercel logs or external service)

### 12. Documentation

- [ ] User documentation (/docs)
  - [ ] Getting started guide
  - [ ] GitHub OAuth setup
  - [ ] Generating changelogs
  - [ ] Using AI features
  - [ ] GitHub Actions integration
  - [ ] API documentation
- [ ] Developer documentation
  - [ ] API reference
  - [ ] Webhook payloads
  - [ ] SDK/libraries
- [ ] FAQ page
- [ ] Video tutorials (optional)

### 13. CLI Tool Compatibility

**CRITICAL**: Ensure the CLI tool in the root directory still works!

- [ ] Test CLI tool independently:
  ```bash
  cd ..  # Go to root
  npm install
  npm run build
  npm start
  ```
- [ ] Verify CLI generates changelogs correctly
- [ ] Test CLI with --ai flag
- [ ] Ensure CLI dependencies don't conflict with web app
- [ ] Update root README.md if needed
- [ ] Test both CLI and web app can coexist

### 14. Launch Day Preparation

- [ ] Prepare launch announcement
  - [ ] Blog post
  - [ ] Twitter/X thread
  - [ ] LinkedIn post
  - [ ] Product Hunt submission (optional)
  - [ ] Hacker News post (optional)
- [ ] Prepare support resources
  - [ ] Support email setup (support@changelogai.com)
  - [ ] FAQ with common questions
  - [ ] Video demos
- [ ] Create launch day monitoring dashboard
- [ ] Brief team on launch procedures
- [ ] Set up customer support channels
- [ ] Prepare rollback plan (if issues occur)

### 15. Post-Launch (First 24 Hours)

- [ ] Monitor error rates and uptime
- [ ] Watch signup funnel conversion
- [ ] Check payment processing
- [ ] Monitor email deliverability
- [ ] Review user feedback
- [ ] Check database performance
- [ ] Verify all integrations working
- [ ] Monitor AI API usage and costs
- [ ] Track key metrics in PostHog
- [ ] Be ready to respond to support requests

### 16. First Week

- [ ] Gather user feedback
- [ ] Fix critical bugs (if any)
- [ ] Optimize based on analytics
- [ ] Send thank you emails to early adopters
- [ ] Create changelog for initial version
- [ ] Plan next features based on feedback

## Quick Reference

### Critical URLs to Test
- [ ] Homepage: `https://your-domain.com`
- [ ] Login: `https://your-domain.com/login`
- [ ] Dashboard: `https://your-domain.com/dashboard`
- [ ] Pricing: `https://your-domain.com/pricing`
- [ ] Referral: `https://your-domain.com/referral`
- [ ] Admin: `https://your-domain.com/admin`
- [ ] Privacy: `https://your-domain.com/privacy`
- [ ] Terms: `https://your-domain.com/terms`

### Critical API Endpoints to Test
- [ ] `POST /api/auth/signin`
- [ ] `POST /api/changelogs/generate`
- [ ] `POST /api/subscription/create-checkout`
- [ ] `POST /api/webhooks/stripe`
- [ ] `GET /api/emails/digest`
- [ ] `POST /api/referrals/generate`

### Environment Checklist
- [ ] All 15+ environment variables set in Vercel
- [ ] NEXTAUTH_SECRET generated (use `openssl rand -base64 32`)
- [ ] CRON_SECRET generated
- [ ] Production URLs updated everywhere
- [ ] API keys are production keys (not test)

## Final Go/No-Go Decision

**Before going live, answer YES to all:**

- [ ] All critical functionality tested and working
- [ ] Payment processing tested with real transaction
- [ ] Email delivery working and tested
- [ ] GitHub OAuth working
- [ ] AI features working (or graceful fallback)
- [ ] Database migrations applied
- [ ] Security audit passed
- [ ] Legal pages published
- [ ] Support system ready
- [ ] Monitoring and alerts configured
- [ ] Rollback plan in place
- [ ] CLI tool still works (backward compatible)

**If any answer is NO, do not launch. Fix the issue first.**

## Rollback Procedure

If critical issues occur:

1. **Immediate**: Switch Vercel deployment to previous stable version
2. **Communication**: Notify users via status page and social media
3. **Investigation**: Identify root cause
4. **Fix**: Create hotfix in separate branch
5. **Test**: Thoroughly test fix
6. **Deploy**: Deploy fix when ready
7. **Monitor**: Watch metrics closely after fix

## Support

- **Emergency Contact**: [Your phone/email]
- **Vercel Status**: https://vercel-status.com
- **Supabase Status**: https://status.supabase.com
- **Stripe Status**: https://status.stripe.com

---

**Last Updated**: [Current Date]

**Reviewed By**: [Your Name]

**Launch Date**: [Target Launch Date]

**Status**: [ ] Not Started | [ ] In Progress | [ ] Ready to Launch | [ ] Live
