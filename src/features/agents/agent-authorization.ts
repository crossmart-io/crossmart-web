import { AgentScope } from '@/api/schema';
import {
  AGENT_READ_SCOPES,
  AgentAccessLevel,
  OAUTH_QUERY,
  OAUTH_SCOPE_SEPARATOR,
} from './agents.constants';

const AGENT_SCOPE_VALUES = new Set<string>(Object.values(AgentScope));

function isAgentScope(value: string): value is AgentScope {
  return AGENT_SCOPE_VALUES.has(value);
}

function scopesOf(search: string): string[] {
  const scope = new URLSearchParams(search).get(OAUTH_QUERY.scope) ?? '';
  return scope.split(OAUTH_SCOPE_SEPARATOR).filter(Boolean);
}

/** The agent's client id, from the authorization query. */
export function agentClientId(search: string): string | null {
  return new URLSearchParams(search).get(OAUTH_QUERY.clientId);
}

/** The Crossmart scopes the agent asks for. */
export function requestedAgentScopes(search: string): AgentScope[] {
  return scopesOf(search).filter(isAgentScope);
}

/**
 * The `scope` to accept: everything asked for at full access; for read-only, the read scopes plus
 * the ones that grant nothing in the workspace (such as `offline_access`).
 */
export function acceptedScope(search: string, level: AgentAccessLevel): string {
  const requested = scopesOf(search);
  const accepted =
    level === AgentAccessLevel.Full
      ? requested
      : requested.filter((scope) => !isAgentScope(scope) || AGENT_READ_SCOPES.includes(scope));
  return accepted.join(OAUTH_SCOPE_SEPARATOR);
}

/** True when the agent asks for anything beyond reading, so read-only is a real choice. */
export function asksToWrite(scopes: readonly AgentScope[]): boolean {
  return scopes.some((scope) => !AGENT_READ_SCOPES.includes(scope));
}

/** The site an agent belongs to, and whether Crossmart checked it. */
export interface AgentSite {
  host: string;
  verified: boolean;
}

const HTTPS_PROTOCOL = 'https:';

function httpsHostOf(address: string | null | undefined): string | undefined {
  if (!address) return undefined;
  try {
    const url = new URL(address);
    return url.protocol === HTTPS_PROTOCOL ? url.host : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Where the agent comes from. A client id that is an HTTPS URL is a metadata document Crossmart
 * fetched from that site, so its host is verified (and its `client_uri` must share it). A client
 * that registered itself only claims its `client_uri`, so that one is shown as unverified.
 */
export function agentSite(clientId: string | null, clientUri?: string | null): AgentSite | null {
  const documentHost = httpsHostOf(clientId);
  if (documentHost) return { host: documentHost, verified: true };
  const claimedHost = httpsHostOf(clientUri);
  return claimedHost ? { host: claimedHost, verified: false } : null;
}
