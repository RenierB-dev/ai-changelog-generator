import { Resend } from 'resend';
import { render } from '@react-email/components';
import WelcomeEmail from './templates/welcome';
import ChangelogReadyEmail from './templates/changelog-ready';
import WeeklyDigestEmail from './templates/weekly-digest';
import UpgradePromptEmail from './templates/upgrade-prompt';
import GitHubActionEmail from './templates/github-action';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || 'notifications@changelogai.com';

interface SendEmailParams {
  to: string;
  subject: string;
  react: React.ReactElement;
}

async function sendEmail({ to, subject, react }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      react,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email send exception:', error);
    return { success: false, error };
  }
}

// Welcome email when user signs up
export async function sendWelcomeEmail(to: string, userName: string) {
  return sendEmail({
    to,
    subject: 'Welcome to ChangelogAI! 🚀',
    react: WelcomeEmail({ userName }),
  });
}

// Notification when changelog is ready
export async function sendChangelogReadyEmail(params: {
  to: string;
  userName: string;
  version: string;
  repository: string;
  changesCount: number;
  aiEnhanced: boolean;
  changelogUrl: string;
  tweetText?: string;
}) {
  return sendEmail({
    to: params.to,
    subject: `Your changelog for ${params.version} is ready! 📝`,
    react: ChangelogReadyEmail(params),
  });
}

// Weekly digest email
export async function sendWeeklyDigestEmail(params: {
  to: string;
  userName: string;
  changelogsGenerated: number;
  aiPolishUsed: number;
  topRepository: string;
  totalChanges: number;
  subscriptionTier: 'free' | 'pro' | 'team';
  remainingCredits?: number;
}) {
  return sendEmail({
    to: params.to,
    subject: `Your ChangelogAI weekly summary - ${params.changelogsGenerated} changelogs generated`,
    react: WeeklyDigestEmail(params),
  });
}

// Upgrade prompt email
export async function sendUpgradePromptEmail(params: {
  to: string;
  userName: string;
  changelogsGenerated: number;
  monthlyLimit: number;
  trigger: 'limit_reached' | 'ai_feature_attempt' | 'pdf_export_attempt';
}) {
  const subjects = {
    limit_reached: "You've reached your monthly limit",
    ai_feature_attempt: 'Unlock AI-powered changelog polish',
    pdf_export_attempt: 'Unlock PDF export with Pro',
  };

  return sendEmail({
    to: params.to,
    subject: subjects[params.trigger],
    react: UpgradePromptEmail(params),
  });
}

// GitHub Action setup guide email
export async function sendGitHubActionEmail(params: {
  to: string;
  userName: string;
  repository: string;
}) {
  return sendEmail({
    to: params.to,
    subject: 'Automate your changelogs with GitHub Actions ⚡',
    react: GitHubActionEmail(params),
  });
}

// Send email to multiple recipients (team notifications)
export async function sendTeamNotification(params: {
  to: string[];
  version: string;
  repository: string;
  changesCount: number;
  aiEnhanced: boolean;
  changelogUrl: string;
}) {
  const promises = params.to.map((email) =>
    sendChangelogReadyEmail({
      to: email,
      userName: email.split('@')[0],
      version: params.version,
      repository: params.repository,
      changesCount: params.changesCount,
      aiEnhanced: params.aiEnhanced,
      changelogUrl: params.changelogUrl,
    })
  );

  const results = await Promise.allSettled(promises);

  const succeeded = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return {
    success: failed === 0,
    succeeded,
    failed,
  };
}

// Generic email sender (for custom templates)
export async function sendCustomEmail(
  to: string,
  subject: string,
  html: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Custom email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Custom email send exception:', error);
    return { success: false, error };
  }
}
