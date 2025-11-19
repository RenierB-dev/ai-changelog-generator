import { trackEvent } from './posthog';

// User Events
export const trackUserSignedUp = (params: {
  userId: string;
  email: string;
  signupMethod: 'github' | 'email';
}) => {
  trackEvent('user_signed_up', {
    user_id: params.userId,
    email: params.email,
    signup_method: params.signupMethod,
    timestamp: new Date().toISOString(),
  });
};

// Repository Events
export const trackRepoConnected = (params: {
  userId: string;
  repoId: string;
  repoName: string;
  isFirstRepo: boolean;
}) => {
  trackEvent('repo_connected', {
    user_id: params.userId,
    repo_id: params.repoId,
    repo_name: params.repoName,
    is_first_repo: params.isFirstRepo,
    timestamp: new Date().toISOString(),
  });
};

// Changelog Events
export const trackChangelogGenerated = (params: {
  userId: string;
  changelogId: string;
  repository: string;
  version?: string;
  changesCount: number;
  aiEnhanced: boolean;
  format: 'markdown' | 'json' | 'pdf';
}) => {
  trackEvent('changelog_generated', {
    user_id: params.userId,
    changelog_id: params.changelogId,
    repository: params.repository,
    version: params.version,
    changes_count: params.changesCount,
    ai_enhanced: params.aiEnhanced,
    format: params.format,
    timestamp: new Date().toISOString(),
  });
};

export const trackAIPolishUsed = (params: {
  userId: string;
  changelogId: string;
  commitsCount: number;
  processingTime: number;
}) => {
  trackEvent('ai_polish_used', {
    user_id: params.userId,
    changelog_id: params.changelogId,
    commits_count: params.commitsCount,
    processing_time_ms: params.processingTime,
    timestamp: new Date().toISOString(),
  });
};

// Export Events
export const trackPDFExported = (params: {
  userId: string;
  changelogId: string;
  pageCount: number;
}) => {
  trackEvent('pdf_exported', {
    user_id: params.userId,
    changelog_id: params.changelogId,
    page_count: params.pageCount,
    timestamp: new Date().toISOString(),
  });
};

export const trackMarkdownExported = (params: {
  userId: string;
  changelogId: string;
}) => {
  trackEvent('markdown_exported', {
    user_id: params.userId,
    changelog_id: params.changelogId,
    timestamp: new Date().toISOString(),
  });
};

export const trackJSONExported = (params: {
  userId: string;
  changelogId: string;
}) => {
  trackEvent('json_exported', {
    user_id: params.userId,
    changelog_id: params.changelogId,
    timestamp: new Date().toISOString(),
  });
};

// GitHub Action Events
export const trackGitHubActionInstalled = (params: {
  userId: string;
  repository: string;
}) => {
  trackEvent('github_action_installed', {
    user_id: params.userId,
    repository: params.repository,
    timestamp: new Date().toISOString(),
  });
};

// Subscription Events
export const trackUpgradeToPro = (params: {
  userId: string;
  plan: 'pro' | 'team';
  billingCycle: 'monthly' | 'annual';
  amount: number;
}) => {
  trackEvent('upgrade_to_pro', {
    user_id: params.userId,
    plan: params.plan,
    billing_cycle: params.billingCycle,
    amount: params.amount,
    timestamp: new Date().toISOString(),
  });
};

export const trackSubscriptionCancelled = (params: {
  userId: string;
  plan: 'pro' | 'team';
  reason?: string;
}) => {
  trackEvent('subscription_cancelled', {
    user_id: params.userId,
    plan: params.plan,
    reason: params.reason,
    timestamp: new Date().toISOString(),
  });
};

// Referral Events
export const trackReferralSent = (params: {
  userId: string;
  method: 'twitter' | 'linkedin' | 'email' | 'copy';
}) => {
  trackEvent('referral_sent', {
    user_id: params.userId,
    method: params.method,
    timestamp: new Date().toISOString(),
  });
};

export const trackReferralCompleted = (params: {
  referrerId: string;
  referredId: string;
}) => {
  trackEvent('referral_completed', {
    referrer_id: params.referrerId,
    referred_id: params.referredId,
    timestamp: new Date().toISOString(),
  });
};

// Feature Usage Events
export const trackTemplateSelected = (params: {
  userId: string;
  templateId: string;
  templateName: string;
}) => {
  trackEvent('template_selected', {
    user_id: params.userId,
    template_id: params.templateId,
    template_name: params.templateName,
    timestamp: new Date().toISOString(),
  });
};

export const trackAIFeatureAttempted = (params: {
  userId: string;
  feature: 'rewrite' | 'group' | 'summarize';
  hasAccess: boolean;
}) => {
  trackEvent('ai_feature_attempted', {
    user_id: params.userId,
    feature: params.feature,
    has_access: params.hasAccess,
    timestamp: new Date().toISOString(),
  });
};

// Onboarding Events
export const trackOnboardingStarted = (params: {
  userId: string;
}) => {
  trackEvent('onboarding_started', {
    user_id: params.userId,
    timestamp: new Date().toISOString(),
  });
};

export const trackOnboardingCompleted = (params: {
  userId: string;
  duration: number;
}) => {
  trackEvent('onboarding_completed', {
    user_id: params.userId,
    duration_seconds: duration,
    timestamp: new Date().toISOString(),
  });
};

export const trackOnboardingStepCompleted = (params: {
  userId: string;
  step: string;
  stepNumber: number;
}) => {
  trackEvent('onboarding_step_completed', {
    user_id: params.userId,
    step: params.step,
    step_number: params.stepNumber,
    timestamp: new Date().toISOString(),
  });
};

// Page View Events (automatically tracked by PostHog, but can be manually called if needed)
export const trackPageView = (params: {
  userId?: string;
  page: string;
  properties?: Record<string, any>;
}) => {
  trackEvent('$pageview', {
    user_id: params.userId,
    page: params.page,
    ...params.properties,
    timestamp: new Date().toISOString(),
  });
};

// Error Events
export const trackError = (params: {
  userId?: string;
  error: string;
  errorCode?: string;
  context?: string;
}) => {
  trackEvent('error_occurred', {
    user_id: params.userId,
    error: params.error,
    error_code: params.errorCode,
    context: params.context,
    timestamp: new Date().toISOString(),
  });
};
