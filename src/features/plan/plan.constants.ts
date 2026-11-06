import { Feature, SubscriptionStatus } from '@/api/schema';

export const SUBSCRIPTION_ENDPOINT = '/api/v1/organizations/{organizationId}/subscription';

/** How each feature reads on the page. Plan names and numbers always come from the API. */
export const FEATURE_LABELS: Record<Feature, { label: string; description: string }> = {
  [Feature.active_listings]: {
    label: 'Active listings',
    description: 'Listings live on a channel, across all workspaces',
  },
  [Feature.channel_connections]: {
    label: 'Stores',
    description: 'Connected stores and marketplaces, across all workspaces',
  },
  [Feature.workspaces]: { label: 'Workspaces', description: 'One per brand or client' },
  [Feature.members]: { label: 'Members', description: 'People in any workspace, counted once' },
  [Feature.api_keys]: { label: 'API keys', description: 'Keys that are not revoked or expired' },
  [Feature.ai_credits]: { label: 'AI credits', description: 'Used this month' },
  [Feature.autonomous_agents]: {
    label: 'Autonomous agents',
    description: 'Agents that act without asking first',
  },
  [Feature.bring_your_own_key]: {
    label: 'Your own AI key',
    description: 'Use your AI provider account instead of Crossmart’s',
  },
};

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.ACTIVE]: 'Active',
  [SubscriptionStatus.TRIALING]: 'Trial',
  [SubscriptionStatus.PAST_DUE]: 'Payment due',
  [SubscriptionStatus.CANCELED]: 'Canceled',
};

/** From this share of a limit on, a meter warns that it is running out. */
export const NEAR_LIMIT_RATIO = 0.8;
export const PERCENT = 100;
export const UNLIMITED_LABEL = 'Unlimited';

export const PLAN_COPY = {
  upgrade: 'Upgrade',
  billingSoon: 'Billing coming soon',
  notEnforced: 'Limits are not enforced yet: going past one is shown here but never blocks you.',
  enforced: 'Actions that would go past a limit are refused until the plan is upgraded.',
  legacy: 'Legacy plan',
  legacyNote:
    'This plan is no longer offered. You keep it, with its limits, until you choose one of the current plans.',
  noAccess: 'Only owners and admins can see the plan and its usage.',
  loadError: 'The plan could not be loaded',
} as const;
