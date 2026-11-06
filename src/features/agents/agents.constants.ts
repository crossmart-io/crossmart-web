import { AgentScope } from '@/api/schema';

export const AGENT_CONNECTIONS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/agent-connections';
export const AGENT_CONNECTION_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/agent-connections/{connectionId}';
export const AGENT_WORKSPACE_ENDPOINT = '/api/v1/oauth/workspace';
export const AGENT_CLIENT_ENDPOINT = '/api/v1/oauth/client';

/** Query parameters of an agent's authorization, as Better Auth signs and forwards them. */
export const OAUTH_QUERY = {
  clientId: 'client_id',
  scope: 'scope',
} as const;

export const OAUTH_SCOPE_SEPARATOR = ' ';

/** How much the user lets the agent do, chosen on the consent page. */
export enum AgentAccessLevel {
  Full = 'full',
  ReadOnly = 'read_only',
}

/** What each scope lets an agent do, in the user's words. */
export const AGENT_SCOPE_DESCRIPTIONS: Readonly<Record<AgentScope, string>> = {
  [AgentScope.catalog_read]: 'See products, stock, stores and AI suggestions',
  [AgentScope.catalog_write]: 'Create and change products, prices and stock',
  [AgentScope.orders_read]: 'See orders',
  [AgentScope.stores_write]: 'Add products to stores and take them off',
  [AgentScope.reports_read]: 'See sales and stock reports',
  [AgentScope.suggestions_write]: 'Ask for AI content and approve suggestions',
};

/** Scopes a read-only connection keeps. */
export const AGENT_READ_SCOPES: readonly AgentScope[] = [
  AgentScope.catalog_read,
  AgentScope.orders_read,
  AgentScope.reports_read,
];

/** What an agent can never do, said on the consent page. */
export const AGENT_LIMITS =
  'It can never manage members, API keys, store connections, settings or billing, and never more than your own role allows.';

export const AGENT_FEEDBACK = {
  disconnected: 'Agent disconnected',
  mcpUrlCopied: 'Address copied to the clipboard',
} as const;

/** The access choices on the consent page. */
export const AGENT_ACCESS_LEVEL_COPY: Readonly<
  Record<AgentAccessLevel, { label: string; summary: string }>
> = {
  [AgentAccessLevel.Full]: {
    label: 'Everything it asks for',
    summary: 'It can read and make the changes listed above.',
  },
  [AgentAccessLevel.ReadOnly]: {
    label: 'Read only',
    summary: 'It can look, but not change anything.',
  },
};

export const AGENT_ACCESS_LEVELS: readonly AgentAccessLevel[] = Object.values(AgentAccessLevel);

/** Ids of the access choice inputs, so each label points at its radio. */
export const ACCESS_LEVEL_INPUT_ID_PREFIX = 'agent-access-';
export const WORKSPACE_INPUT_ID_PREFIX = 'agent-workspace-';

/** How the agent's name and site are shown, by how far Crossmart could check them. */
export const AGENT_IDENTITY_COPY = {
  /** Before the host a metadata document client's name came from. */
  verifiedBy: 'Verified by',
  /** Before the site a self-registered agent claims, which Crossmart could not check. */
  claims: 'Says it is from',
  unverifiedSite: 'not verified',
  unverifiedName: 'Unverified name',
  unverifiedNameExplanation:
    'This agent registered itself and chose this name. Any app can call itself Claude or ChatGPT. Continue only if you started connecting this agent just now.',
} as const;

/** Shown until the agent's details load, or when it gives no name. */
export const UNNAMED_AGENT = 'An AI agent';
