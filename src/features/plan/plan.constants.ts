import { Feature } from '@/api/schema';

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
  [Feature.webhook_endpoints]: {
    label: 'Webhook endpoints',
    description: 'URLs that receive events, across all workspaces',
  },
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

/** How a plan's limit reads in a plan card, for one and for many: "1 workspace", "5 API keys". */
export const GRANT_NOUNS: Record<Feature, { one: string; other: string }> = {
  [Feature.active_listings]: { one: 'active listing', other: 'active listings' },
  [Feature.channel_connections]: { one: 'store', other: 'stores' },
  [Feature.workspaces]: { one: 'workspace', other: 'workspaces' },
  [Feature.members]: { one: 'member', other: 'members' },
  [Feature.api_keys]: { one: 'API key', other: 'API keys' },
  [Feature.webhook_endpoints]: { one: 'webhook endpoint', other: 'webhook endpoints' },
  [Feature.ai_credits]: { one: 'AI credit a month', other: 'AI credits a month' },
  [Feature.autonomous_agents]: { one: 'autonomous agent', other: 'autonomous agents' },
  [Feature.bring_your_own_key]: { one: 'own AI key', other: 'own AI keys' },
};

/** From this share of a limit on, a meter warns that it is running out. */
export const NEAR_LIMIT_RATIO = 0.8;
export const PERCENT = 100;
export const UNLIMITED_LABEL = 'Unlimited';

export const PLAN_COPY = {
  loadError: 'The plan could not be loaded',
} as const;
