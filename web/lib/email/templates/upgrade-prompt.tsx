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

interface UpgradePromptEmailProps {
  userName?: string;
  changelogsGenerated: number;
  monthlyLimit: number;
  trigger: 'limit_reached' | 'ai_feature_attempt' | 'pdf_export_attempt';
}

export default function UpgradePromptEmail({
  userName = 'Developer',
  changelogsGenerated,
  monthlyLimit,
  trigger,
}: UpgradePromptEmailProps) {
  const triggerMessages = {
    limit_reached: {
      title: "You've Reached Your Monthly Limit",
      message: `You've generated ${changelogsGenerated} out of ${monthlyLimit} changelogs this month. Upgrade to Pro for unlimited changelogs!`,
    },
    ai_feature_attempt: {
      title: 'AI Polish is a Pro Feature',
      message: 'Transform your commit messages into polished release notes with Claude AI. Upgrade to unlock this powerful feature!',
    },
    pdf_export_attempt: {
      title: 'PDF Export is a Pro Feature',
      message: 'Create professional PDF changelogs for your releases. Upgrade to Pro to unlock PDF export!',
    },
  };

  const { title, message } = triggerMessages[trigger];

  return (
    <Html>
      <Head />
      <Preview>Unlock unlimited changelogs and AI features with ChangelogAI Pro</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{title}</Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>{message}</Text>

          <Section style={proBox}>
            <Heading as="h2" style={h2}>🚀 ChangelogAI Pro - $9/month</Heading>

            <Text style={featureItem}>✅ <strong>Unlimited Changelogs</strong> - Generate as many as you need</Text>
            <Text style={featureItem}>✨ <strong>AI-Powered Polish</strong> - Claude AI rewrites commits for clarity</Text>
            <Text style={featureItem}>📄 <strong>PDF Export</strong> - Professional changelog PDFs</Text>
            <Text style={featureItem}>⚡ <strong>GitHub Actions</strong> - Auto-generate on release</Text>
            <Text style={featureItem}>📧 <strong>Email Notifications</strong> - Team notifications</Text>
            <Text style={featureItem}>🎨 <strong>Custom Templates</strong> - Brand your changelogs</Text>
            <Text style={featureItem}>🔄 <strong>Priority Support</strong> - Get help faster</Text>

            <Button style={upgradeButton} href={`${process.env.NEXT_PUBLIC_APP_URL}/pricing`}>
              Upgrade to Pro - $9/mo
            </Button>
          </Section>

          <Section style={comparisonSection}>
            <Heading as="h3" style={h3}>See the Difference</Heading>

            <Section style={comparisonBox}>
              <Text style={comparisonTitle}>❌ Without AI Polish:</Text>
              <Text style={commitText}>fix bug</Text>
              <Text style={commitText}>update deps</Text>
              <Text style={commitText}>add feature</Text>
            </Section>

            <Section style={comparisonBox}>
              <Text style={comparisonTitle}>✅ With AI Polish (Pro):</Text>
              <Text style={polishedText}>Fixed authentication timeout issue that prevented users from logging in</Text>
              <Text style={polishedText}>Updated security dependencies to patch vulnerabilities</Text>
              <Text style={polishedText}>Added dark mode toggle to user settings for better accessibility</Text>
            </Section>
          </Section>

          <Section style={testimonialSection}>
            <Text style={testimonialText}>
              "Pro tier is a no-brainer. The AI polish alone saves me 30 minutes per release.
              My changelogs went from 'meh' to professional overnight."
            </Text>
            <Text style={testimonialAuthor}>— Sarah Chen, Frontend Lead @ TechCorp</Text>
          </Section>

          <Section style={guaranteeBox}>
            <Text style={guaranteeTitle}>💯 30-Day Money-Back Guarantee</Text>
            <Text style={text}>
              Try Pro risk-free. If you're not completely satisfied, we'll refund you. No questions asked.
            </Text>
          </Section>

          <Button style={ctaButton} href={`${process.env.NEXT_PUBLIC_APP_URL}/pricing`}>
            Start Pro Trial - $9/mo
          </Button>

          <Section style={footer}>
            <Text style={footerText}>
              Questions? Reply to this email or check our{' '}
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}/pricing`}>pricing page</a>.
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
  color: '#10b981',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
};

const h3 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
  margin: '12px 0',
};

const proBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '12px',
  padding: '30px',
  margin: '24px 40px',
  border: '2px solid #10b981',
};

const featureItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '8px 0',
};

const upgradeButton = {
  backgroundColor: '#10b981',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  maxWidth: '280px',
  padding: '14px 0',
  margin: '24px auto 0',
};

const comparisonSection = {
  padding: '0 40px',
  marginTop: '32px',
};

const comparisonBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '16px',
};

const comparisonTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#666',
  margin: '0 0 12px 0',
};

const commitText = {
  fontSize: '14px',
  color: '#999',
  fontFamily: 'monospace',
  margin: '4px 0',
};

const polishedText = {
  fontSize: '14px',
  color: '#333',
  margin: '8px 0',
  lineHeight: '22px',
};

const testimonialSection = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 40px',
  borderLeft: '4px solid #0ea5e9',
};

const testimonialText = {
  fontSize: '16px',
  color: '#333',
  fontStyle: 'italic',
  lineHeight: '26px',
  margin: '0 0 12px 0',
};

const testimonialAuthor = {
  fontSize: '14px',
  color: '#666',
  margin: '0',
};

const guaranteeBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 40px',
  textAlign: 'center' as const,
};

const guaranteeTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#92400e',
  margin: '0 0 8px 0',
};

const ctaButton = {
  backgroundColor: '#0ea5e9',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '280px',
  padding: '16px 0',
  margin: '32px auto',
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
