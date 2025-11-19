import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WeeklyDigestEmailProps {
  userName?: string;
  changelogsGenerated: number;
  aiPolishUsed: number;
  topRepository: string;
  totalChanges: number;
  subscriptionTier: 'free' | 'pro' | 'team';
  remainingCredits?: number;
}

export default function WeeklyDigestEmail({
  userName = 'Developer',
  changelogsGenerated,
  aiPolishUsed,
  topRepository,
  totalChanges,
  subscriptionTier,
  remainingCredits,
}: WeeklyDigestEmailProps) {
  const isFree = subscriptionTier === 'free';

  return (
    <Html>
      <Head />
      <Preview>Your ChangelogAI weekly summary - {changelogsGenerated} changelogs generated</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Week in Changelogs 📊</Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            Here's a summary of your ChangelogAI activity this week:
          </Text>

          <Section style={statsContainer}>
            <Section style={statBox}>
              <Text style={statNumber}>{changelogsGenerated}</Text>
              <Text style={statLabel}>Changelogs Generated</Text>
            </Section>
            <Section style={statBox}>
              <Text style={statNumber}>{totalChanges}</Text>
              <Text style={statLabel}>Changes Documented</Text>
            </Section>
            {!isFree && (
              <Section style={statBox}>
                <Text style={statNumber}>{aiPolishUsed}</Text>
                <Text style={statLabel}>AI Polishes Used</Text>
              </Section>
            )}
          </Section>

          <Section style={highlightBox}>
            <Text style={highlightTitle}>🏆 Most Active Repository</Text>
            <Text style={highlightText}>{topRepository}</Text>
          </Section>

          {isFree && remainingCredits !== undefined && (
            <Section style={warningBox}>
              <Text style={warningText}>
                ⚠️ You have <strong>{remainingCredits} changelogs</strong> remaining this month
              </Text>
              {remainingCredits <= 2 && (
                <Text style={text}>
                  You're running low on credits. Upgrade to Pro for unlimited changelogs!
                </Text>
              )}
            </Section>
          )}

          <Section style={tipsSection}>
            <Heading as="h2" style={h2}>💡 Tips to Get More Value</Heading>
            <Text style={listItem}>
              ✅ Set up GitHub Actions to auto-generate changelogs on release
            </Text>
            <Text style={listItem}>
              ✅ Use conventional commits for better auto-categorization
            </Text>
            <Text style={listItem}>
              ✅ Export changelogs as PDF for professional documentation
            </Text>
            {isFree && (
              <Text style={listItem}>
                ✅ Upgrade to Pro for AI-powered polish that transforms commit messages
              </Text>
            )}
          </Section>

          {isFree ? (
            <Section style={upgradeSection}>
              <Heading as="h2" style={h2}>🚀 Upgrade to Pro</Heading>
              <Text style={text}>
                Get unlimited changelogs, AI polish, PDF export, and GitHub Actions for just $9/month.
              </Text>
              <Button style={upgradeButton} href={`${process.env.NEXT_PUBLIC_APP_URL}/pricing`}>
                Upgrade to Pro
              </Button>
            </Section>
          ) : (
            <Section style={thankYouSection}>
              <Text style={text}>
                Thanks for being a {subscriptionTier === 'pro' ? 'Pro' : 'Team'} subscriber!
                Your support helps us build better tools for developers.
              </Text>
            </Section>
          )}

          <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
            View Dashboard
          </Button>

          <Section style={footer}>
            <Text style={footerText}>
              Don't want weekly digests?{' '}
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}/settings/notifications`}>
                Manage email preferences
              </a>
            </Text>
            <Text style={footerText}>
              Happy building!<br />
              The ChangelogAI Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
};

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 12px',
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
  margin: '12px 0',
};

const listItem = {
  ...text,
  margin: '8px 0',
  fontSize: '15px',
};

const statsContainer = {
  display: 'flex',
  justifyContent: 'space-around',
  padding: '20px 40px',
};

const statBox = {
  textAlign: 'center' as const,
  padding: '20px',
};

const statNumber = {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#0ea5e9',
  margin: '0',
};

const statLabel = {
  fontSize: '14px',
  color: '#666',
  margin: '8px 0 0 0',
};

const highlightBox = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 40px',
  textAlign: 'center' as const,
};

const highlightTitle = {
  fontSize: '14px',
  color: '#0369a1',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const highlightText = {
  fontSize: '20px',
  color: '#333',
  fontWeight: 'bold',
  margin: '0',
};

const warningBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 40px',
};

const warningText = {
  fontSize: '16px',
  color: '#92400e',
  margin: '0 0 8px 0',
};

const tipsSection = {
  padding: '0 40px',
  marginTop: '32px',
};

const upgradeSection = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 40px',
};

const thankYouSection = {
  padding: '0 40px',
  marginTop: '24px',
};

const button = {
  backgroundColor: '#0ea5e9',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px 0',
  margin: '24px 40px',
};

const upgradeButton = {
  ...button,
  backgroundColor: '#10b981',
};

const footer = {
  padding: '24px 40px',
  borderTop: '1px solid #eee',
  marginTop: '32px',
};

const footerText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};
