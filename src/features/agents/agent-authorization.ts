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
