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

interface WelcomeEmailProps {
  userName?: string;
}

export default function WelcomeEmail({ userName = 'Developer' }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to ChangelogAI! Generate beautiful changelogs in seconds.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to ChangelogAI! 🚀</Heading>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            Thanks for joining ChangelogAI! You're now ready to generate beautiful,
            AI-powered changelogs from your git commits.
          </Text>

          <Section style={section}>
            <Heading as="h2" style={h2}>Quick Start Guide</Heading>
            <Text style={listItem}>✅ Connect your GitHub repository</Text>
            <Text style={listItem}>✅ Generate your first changelog</Text>
            <Text style={listItem}>✅ Try AI polish (Pro feature)</Text>
            <Text style={listItem}>✅ Export as Markdown or PDF</Text>
            <Text style={listItem}>✅ Set up GitHub Actions for automation</Text>
          </Section>

          <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
            Get Started
          </Button>

          <Text style={text}>
            <strong>Free Tier includes:</strong> 10 changelogs per month, rule-based categorization,
            and Markdown/JSON export.
          </Text>

          <Text style={text}>
            <strong>Upgrade to Pro ($9/mo):</strong> Unlimited changelogs, AI-powered polish,
            PDF export, GitHub Actions, and email notifications.
          </Text>

          <Section style={footer}>
            <Text style={footerText}>
              Need help? Reply to this email or visit our{' '}
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}/docs`}>documentation</a>.
            </Text>
            <Text style={footerText}>
              Happy changelog generating!<br />
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
  margin: '24px 0 16px',
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

const section = {
  padding: '0 40px',
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
