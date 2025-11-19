# ChangelogAI Pro - Web Dashboard

Beautiful AI-powered changelog generation dashboard with GitHub integration, team collaboration, and premium features.

## Features

### Free Tier
- ✅ Connect GitHub repositories
- ✅ Generate changelogs from git history
- ✅ Rule-based categorization
- ✅ Export to Markdown/JSON
- ✅ 10 changelogs per month

### Pro Tier ($9/month)
- 🚀 **AI-Powered Polish**: Claude AI rewrites commits into clear release notes
- 🎨 **Smart Categorization**: AI understands context and groups changes intelligently
- 📊 **PDF Export**: Professional PDF changelogs
- 🔄 **GitHub Actions**: Auto-generate changelogs on release
- 📧 **Email Notifications**: Team notifications when changelogs are ready
- ♾️ **Unlimited Changelogs**

### Team Tier ($29/month)
- 👥 Team collaboration
- 🏢 Multiple repositories
- 📈 Analytics & insights
- 🎯 Custom templates
- 🔐 SSO support

## Quick Start

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-changelog-generator.git
cd ai-changelog-generator/web
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see [DEPLOYMENT.md](./DEPLOYMENT.md) for setup guides)

4. **Run development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-changelog-generator)

1. Click the button above or follow [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Configure environment variables
3. Deploy!

**Important**: Set Root Directory to `web` in Vercel project settings.

### Manual Deployment

See detailed deployment instructions in [DEPLOYMENT.md](./DEPLOYMENT.md)

## Project Structure

```
web/
├── app/                      # Next.js 14 App Router
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth.js routes
│   │   ├── emails/         # Email sending endpoints
│   │   ├── webhooks/       # Stripe/GitHub webhooks
│   │   └── changelogs/     # Changelog generation
│   ├── admin/              # Admin dashboard
│   ├── dashboard/          # User dashboard
│   └── referral/           # Referral program
├── components/              # React components
│   ├── onboarding/         # Product tour & welcome
│   ├── changelogs/         # Changelog UI components
│   └── ui/                 # Shared UI components
├── lib/                     # Utilities & configurations
│   ├── email/              # Email templates & sending
│   │   ├── templates/      # React Email templates
│   │   ├── send.ts        # Email sending logic
│   │   └── schedule.ts    # Scheduled emails
│   ├── analytics/          # PostHog integration
│   ├── supabase/           # Database client
│   ├── stripe/             # Payment processing
│   └── github/             # GitHub API integration
└── public/                  # Static assets
```

## Configuration Guides

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set callback URL: `https://your-app.vercel.app/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`

See detailed guide in [DEPLOYMENT.md](./DEPLOYMENT.md#2-github-oauth-setup)

### AI Feature Configuration

The Pro tier uses Anthropic's Claude AI for:
- **Smart Commit Rewriting**: Transforms "fix bug" → "Fixed authentication timeout issue"
- **Intelligent Grouping**: Groups related changes together
- **Release Summaries**: Generates overview of the release

Setup:
1. Get API key from [Anthropic Console](https://console.anthropic.com)
2. Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-...`

### Stripe Integration

Set up payment processing for Pro/Team tiers:

1. **Create Stripe Account**: [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Create Products**:
   - Pro: $9/month
   - Team: $29/month
3. **Configure Webhook**: `/api/webhooks/stripe`
4. **Add keys to `.env.local`**

Full guide: [DEPLOYMENT.md](./DEPLOYMENT.md#4-stripe-payment-setup)

### Email Notifications

Automated emails for:
- 📧 Welcome emails
- 🔔 Changelog ready notifications
- 📊 Weekly usage digests
- 💎 Upgrade prompts

Setup with [Resend](https://resend.com):
1. Create account & verify domain
2. Get API key
3. Add to `.env.local`: `RESEND_API_KEY=re_...`

## Features Deep Dive

### Email Marketing System

Located in `lib/email/`:

**Templates** (`lib/email/templates/`):
- `welcome.tsx` - Welcome new users
- `changelog-ready.tsx` - Notify when changelog is generated
- `weekly-digest.tsx` - Weekly usage summary
- `upgrade-prompt.tsx` - Encourage Pro upgrade
- `github-action.tsx` - GitHub Action setup guide

**API Routes** (`app/api/emails/`):
- `/api/emails/welcome` - Send welcome email
- `/api/emails/notify` - Changelog notifications
- `/api/emails/digest` - Weekly digests (cron)

### Onboarding Flow

Interactive product tour using `react-joyride`:

Components in `components/onboarding/`:
- `ProductTour.tsx` - Step-by-step guide
- `WelcomeModal.tsx` - First-time user modal
- `QuickStartChecklist.tsx` - Progress tracking

Tour Steps:
1. Connect GitHub repository
2. Generate first changelog
3. Try AI polish feature
4. Export as markdown/PDF
5. Set up GitHub Action (optional)

### Referral System

Share with developers, earn free months:

**Database Schema**:
```sql
referral_codes(id, user_id, code, uses)
referrals(id, referrer_id, referred_id, code, status)
```

**Features**:
- Unique referral codes
- Automatic credit application
- Tracking dashboard
- Social sharing

### Analytics Tracking

PostHog events tracked:
- `user_signed_up`
- `repo_connected`
- `changelog_generated`
- `ai_polish_used` (Pro feature)
- `pdf_exported`
- `github_action_installed`
- `upgrade_to_pro`
- `referral_sent`

### Admin Dashboard

Located at `/admin`:

**Metrics**:
- Total users & Pro subscribers
- MRR (Monthly Recurring Revenue)
- Changelogs generated
- AI feature usage rate
- Popular templates
- GitHub Actions installed

**Insights**:
- User growth charts
- Revenue trends
- Feature adoption
- Export format popularity

## CLI Integration

The CLI tool (`../`) still works independently!

```bash
# In root directory, CLI works as before
cd ..
npm start -- --ai --from v1.0.0 --to v2.0.0
```

The web dashboard uses the same core logic but adds:
- Visual interface
- GitHub integration
- Team collaboration
- Payment processing
- AI enhancements

## API Routes

### Changelog Generation
```
POST /api/changelogs/generate
{
  "repository": "owner/repo",
  "from": "v1.0.0",
  "to": "v2.0.0",
  "aiPolish": true
}
```

### Subscription Management
```
POST /api/subscription/create-checkout
POST /api/subscription/manage
GET /api/subscription/status
```

### GitHub Integration
```
GET /api/github/repos
POST /api/github/connect
GET /api/github/branches
```

## Environment Variables

See [.env.example](./.env.example) for all required variables.

**Required**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

**Optional** (for Pro features):
- `ANTHROPIC_API_KEY` - AI polish features
- `STRIPE_SECRET_KEY` - Payment processing
- `RESEND_API_KEY` - Email notifications
- `NEXT_PUBLIC_POSTHOG_KEY` - Analytics

## Testing

```bash
# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## Production Checklist

Before launching, complete [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md):
- [ ] All environment variables set
- [ ] GitHub OAuth configured
- [ ] Stripe products created
- [ ] Database migrated
- [ ] Email domain verified
- [ ] Analytics configured
- [ ] Privacy policy added
- [ ] Terms of service added

## Support & Documentation

- **Documentation**: [docs.changelogai.com](https://docs.changelogai.com)
- **GitHub Issues**: [github.com/yourusername/ai-changelog-generator/issues](https://github.com/yourusername/ai-changelog-generator/issues)
- **Email**: support@changelogai.com
- **Discord**: [discord.gg/changelogai](https://discord.gg/changelogai)

## License

MIT - See [LICENSE](../LICENSE)

## Contributing

Contributions welcome! See [CONTRIBUTING.md](../CONTRIBUTING.md)

---

Built with ❤️ using Next.js, Supabase, Stripe, and Anthropic Claude AI
