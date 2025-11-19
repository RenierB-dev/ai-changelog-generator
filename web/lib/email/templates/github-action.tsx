import {
  Body,
  Button,
  Code,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface GitHubActionEmailProps {
  userName?: string;
  repository: string;
}

export default function GitHubActionEmail({
  userName = 'Developer',
  repository,
}: GitHubActionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Automate your changelogs with GitHub Actions</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Automate Your Changelogs! ⚡</Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            Great news! You can now automatically generate changelogs when you create a new release.
            Set up our GitHub Action in <strong>{repository}</strong> in just 2 minutes.
          </Text>

          <Section style={benefitsBox}>
            <Heading as="h2" style={h2}>Why Use GitHub Actions?</Heading>
            <Text style={benefitItem}>⚡ Auto-generate changelogs on every release</Text>
            <Text style={benefitItem}>📝 Changelog added to release notes automatically</Text>
            <Text style={benefitItem}>🔄 Always up-to-date with latest changes</Text>
            <Text style={benefitItem}>👥 Team gets notified via email</Text>
            <Text style={benefitItem}>🎨 Consistent formatting across all releases</Text>
          </Section>

          <Section style={setupSection}>
            <Heading as="h2" style={h2}>Quick Setup (2 minutes)</Heading>

            <Text style={stepTitle}>Step 1: Create workflow file</Text>
            <Text style={text}>
              Create <Code style={inlineCode}>.github/workflows/changelog.yml</Code> in your repository:
            </Text>

            <Section style={codeBlock}>
              <Text style={codeText}>{`name: Generate Changelog

on:
  release:
    types: [created]

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Generate Changelog
        uses: changelogai/action@v1
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
          api-key: \${{ secrets.CHANGELOGAI_API_KEY }}
          ai-polish: true  # Pro feature

      - name: Update Release
        uses: softprops/action-gh-release@v1
        with:
          body_path: CHANGELOG.md`}</Text>
            </Section>

            <Text style={stepTitle}>Step 2: Add your API key</Text>
            <Text style={text}>
              1. Go to{' '}
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}/settings/api-keys`}>
                Settings → API Keys
              </a>
            </Text>
            <Text style={text}>
              2. Copy your API key
            </Text>
            <Text style={text}>
              3. Add it to GitHub Secrets as <Code style={inlineCode}>CHANGELOGAI_API_KEY</Code>
            </Text>

            <Text style={stepTitle}>Step 3: Create a release</Text>
            <Text style={text}>
              Create a new release on GitHub, and your changelog will be generated automatically!
            </Text>
          </Section>

          <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/docs/github-actions`}>
            View Full Documentation
          </Button>

          <Section style={tipsSection}>
            <Heading as="h3" style={h3}>💡 Pro Tips</Heading>
            <Text style={tipItem}>
              • Use <Code style={inlineCode}>ai-polish: true</Code> for AI-enhanced changelogs (Pro tier)
            </Text>
            <Text style={tipItem}>
              • Add <Code style={inlineCode}>format: pdf</Code> to generate PDF changelogs
            </Text>
            <Text style={tipItem}>
              • Customize the template with <Code style={inlineCode}>template: custom</Code>
            </Text>
            <Text style={tipItem}>
              • Send notifications with <Code style={inlineCode}>notify: team</Code>
            </Text>
          </Section>

          <Section style={exampleSection}>
            <Heading as="h3" style={h3}>Example Output</Heading>
            <Text style={text}>
              When you create a release, the action will:
            </Text>
            <Text style={exampleItem}>1. Analyze commits since last release</Text>
            <Text style={exampleItem}>2. Categorize changes automatically</Text>
            <Text style={exampleItem}>3. Apply AI polish (Pro tier)</Text>
            <Text style={exampleItem}>4. Add formatted changelog to release notes</Text>
            <Text style={exampleItem}>5. Notify your team via email</Text>
          </Section>

          <Section style={upgradeBox}>
            <Text style={upgradeText}>
              🚀 <strong>Pro users get AI-polished changelogs in their releases!</strong>
            </Text>
            <Text style={text}>
              Upgrade to Pro for AI-powered polish, unlimited changelogs, and priority support.
            </Text>
            <Button style={upgradeButton} href={`${process.env.NEXT_PUBLIC_APP_URL}/pricing`}>
              Upgrade to Pro - $9/mo
            </Button>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Need help? Check our{' '}
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}/docs/github-actions`}>
                GitHub Actions documentation
              </a>{' '}
              or reply to this email.
            </Text>
            <Text style={footerText}>
              Happy automating!<br />
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
  padding: '0 40px',
};

const h3 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 12px',
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
  margin: '12px 0',
};

const stepTitle = {
  color: '#0ea5e9',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '0 40px',
  margin: '20px 0 8px',
};

const benefitsBox = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  padding: '20px 40px',
  margin: '24px 40px',
};

const benefitItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '6px 0',
};

const setupSection = {
  marginTop: '32px',
};

const codeBlock = {
  backgroundColor: '#1e293b',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 40px',
  overflow: 'auto',
};

const codeText = {
  color: '#e2e8f0',
  fontSize: '13px',
  fontFamily: 'monospace',
  lineHeight: '20px',
  whiteSpace: 'pre' as const,
  margin: '0',
};

const inlineCode = {
  backgroundColor: '#f1f5f9',
  color: '#e11d48',
  padding: '2px 6px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '14px',
};

const tipsSection = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '20px',
  margin: '32px 40px',
};

const tipItem = {
  color: '#333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
  padding: '0 20px',
};

const exampleSection = {
  padding: '0 40px',
  marginTop: '32px',
};

const exampleItem = {
  color: '#666',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '6px 0',
  padding: '0 40px',
};

const upgradeBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  padding: '20px',
  margin: '32px 40px',
  textAlign: 'center' as const,
};

const upgradeText = {
  fontSize: '16px',
  color: '#15803d',
  margin: '0 0 12px 0',
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
  width: '260px',
  padding: '12px 0',
  margin: '24px auto',
};

const upgradeButton = {
  ...button,
  backgroundColor: '#10b981',
  marginTop: '16px',
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
