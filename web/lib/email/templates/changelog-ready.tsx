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

interface ChangelogReadyEmailProps {
  userName?: string;
  version: string;
  repository: string;
  changesCount: number;
  aiEnhanced: boolean;
  changelogUrl: string;
  tweetText?: string;
}

export default function ChangelogReadyEmail({
  userName = 'Developer',
  version,
  repository,
  changesCount,
  aiEnhanced,
  changelogUrl,
  tweetText,
}: ChangelogReadyEmailProps) {
  const defaultTweet = `Just released ${repository} ${version}! 🚀 Check out what's new:\n\n${changelogUrl}\n\nGenerated with @ChangelogAI`;
  const tweet = tweetText || defaultTweet;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;

  return (
    <Html>
      <Head />
      <Preview>Your changelog for {version} is ready to publish!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Changelog is Ready! 📝</Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            Great news! Your changelog for <strong>{repository} {version}</strong> has been generated.
          </Text>

          <Section style={statsBox}>
            <Text style={statText}>
              📊 <strong>{changesCount}</strong> changes documented
            </Text>
            {aiEnhanced && (
              <Text style={statText}>
                ✨ <strong>AI-enhanced</strong> - Commits rewritten for clarity
              </Text>
            )}
          </Section>

          {aiEnhanced && (
            <Section style={aiSection}>
              <Text style={aiText}>
                🤖 <strong>AI Polish Applied</strong>
              </Text>
              <Text style={text}>
                Claude AI has transformed your commit messages into clear,
                professional release notes that your users will love.
              </Text>
            </Section>
          )}

          <Button style={button} href={changelogUrl}>
            View Changelog
          </Button>

          <Section style={shareSection}>
            <Heading as="h2" style={h2}>Share Your Release</Heading>
            <Text style={text}>
              Let your community know about this release:
            </Text>
            <Button style={twitterButton} href={twitterUrl}>
              Share on Twitter
            </Button>
          </Section>

          <Section style={tipsSection}>
            <Heading as="h3" style={h3}>Next Steps</Heading>
            <Text style={listItem}>📄 Export as Markdown or PDF</Text>
            <Text style={listItem}>📧 Share with your team</Text>
            <Text style={listItem}>🔗 Add to your GitHub release</Text>
            <Text style={listItem}>⚡ Set up GitHub Action for auto-generation</Text>
          </Section>

          {!aiEnhanced && (
            <Section style={upgradeBox}>
              <Heading as="h3" style={h3}>💎 Upgrade to Pro</Heading>
              <Text style={text}>
                Get AI-powered changelog polish, unlimited generations, PDF export,
                and GitHub Actions integration.
              </Text>
              <Button style={upgradeButton} href={`${process.env.NEXT_PUBLIC_APP_URL}/pricing`}>
                Upgrade to Pro - $9/mo
              </Button>
            </Section>
          )}

          <Section style={footer}>
            <Text style={footerText}>
              Keep building great software!<br />
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

const h3 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '16px 0 12px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
};

const listItem = {
  ...text,
  margin: '8px 0',
  fontSize: '15px',
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

const twitterButton = {
  ...button,
  backgroundColor: '#1DA1F2',
};

const upgradeButton = {
  ...button,
  backgroundColor: '#10b981',
  width: '240px',
};

const statsBox = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 40px',
};

const statText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '4px 0',
};

const aiSection = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 40px',
};

const aiText = {
  color: '#92400e',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const shareSection = {
  padding: '0 40px',
  marginTop: '32px',
};

const tipsSection = {
  padding: '0 40px',
  marginTop: '24px',
};

const upgradeBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  padding: '20px',
  margin: '32px 40px',
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
};
