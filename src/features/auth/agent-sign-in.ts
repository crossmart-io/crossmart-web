/** Present only on an AI agent's authorization query, which Better Auth signs. */
const OAUTH_SIGNATURE_QUERY = 'sig';

/**
 * True while signing in or up is a step of an agent's authorization (ADR 0019). Better Auth then
 * sends the browser on to the agent itself, so the page must not move on by its own.
 */
export function isAgentAuthorization(search: string): boolean {
  return new URLSearchParams(search).has(OAUTH_SIGNATURE_QUERY);
}
