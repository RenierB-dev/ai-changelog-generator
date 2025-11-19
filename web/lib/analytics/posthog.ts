'use client';

import posthog from 'posthog-js';

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

    if (apiKey) {
      posthog.init(apiKey, {
        api_host: host,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            posthog.opt_out_capturing(); // Disable in development
          }
        },
      });
    }
  }
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, traits);
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
};

export const resetUser = () => {
  if (typeof window !== 'undefined') {
    posthog.reset();
  }
};

export default posthog;
