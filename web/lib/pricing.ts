export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    interval: 'month',
    features: {
      changelogs_per_month: 10,
      cli_access: true,
      web_dashboard: false,
      ai_polish: false,
      templates: 1, // default template only
      integrations: 0,
      pdf_export: false,
      white_label: false,
      support: 'community',
    },
    limits: {
      max_changelogs: 10,
      max_templates: 1,
      max_integrations: 0,
    },
  },
  pro: {
    name: 'Pro',
    price: 9,
    interval: 'month',
    stripe_price_id: process.env.STRIPE_PRO_PRICE_ID,
    features: {
      changelogs_per_month: -1, // unlimited
      cli_access: true,
      web_dashboard: true,
      ai_polish: true,
      templates: -1, // unlimited
      integrations: 2, // GitHub + 1 other
      pdf_export: true,
      white_label: false,
      support: 'email',
    },
    limits: {
      max_changelogs: -1,
      max_templates: -1,
      max_integrations: 2,
    },
  },
  team: {
    name: 'Team',
    price: 29,
    interval: 'month',
    stripe_price_id: process.env.STRIPE_TEAM_PRICE_ID,
    features: {
      changelogs_per_month: -1,
      cli_access: true,
      web_dashboard: true,
      ai_polish: true,
      templates: -1,
      integrations: -1, // unlimited
      pdf_export: true,
      white_label: true,
      support: 'priority',
      team_members: 5,
      shared_templates: true,
    },
    limits: {
      max_changelogs: -1,
      max_templates: -1,
      max_integrations: -1,
    },
  },
} as const

export type PlanType = keyof typeof PRICING_PLANS

export function canAccessFeature(
  plan: PlanType,
  feature: keyof (typeof PRICING_PLANS)['free']['features']
): boolean {
  const planFeatures = PRICING_PLANS[plan].features
  const featureValue = planFeatures[feature]

  if (typeof featureValue === 'boolean') {
    return featureValue
  }

  if (typeof featureValue === 'number') {
    return featureValue !== 0
  }

  return true
}

export function checkLimit(
  plan: PlanType,
  limit: keyof (typeof PRICING_PLANS)['free']['limits'],
  currentUsage: number
): boolean {
  const limitValue = PRICING_PLANS[plan].limits[limit]

  if (limitValue === -1) {
    return true // unlimited
  }

  return currentUsage < limitValue
}

export function getUpgradeMessage(feature: string): string {
  return `This feature requires a Pro or Team plan. Upgrade to access ${feature}.`
}
