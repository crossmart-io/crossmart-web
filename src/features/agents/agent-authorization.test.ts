import { AgentScope } from '@/api/schema';
import {
  acceptedScope,
  agentClientId,
  asksToWrite,
  requestedAgentScopes,
} from './agent-authorization';
import { AgentAccessLevel } from './agents.constants';

const SEARCH =
  '?client_id=https%3A%2F%2Fclaude.ai%2Foauth%2Fclient.json&scope=catalog%3Aread+catalog%3Awrite+offline_access&sig=abc';

describe('agent authorization query', () => {
  it('names the client and the Crossmart scopes asked for', () => {
    expect(agentClientId(SEARCH)).toBe('https://claude.ai/oauth/client.json');
    expect(requestedAgentScopes(SEARCH)).toEqual([
      AgentScope.catalog_read,
      AgentScope.catalog_write,
    ]);
  });

  it('accepts everything at full access, and drops writing for read-only', () => {
    expect(acceptedScope(SEARCH, AgentAccessLevel.Full)).toBe(
      'catalog:read catalog:write offline_access',
    );
    expect(acceptedScope(SEARCH, AgentAccessLevel.ReadOnly)).toBe('catalog:read offline_access');
  });

  it('offers read-only only when the agent asks to write', () => {
    expect(asksToWrite([AgentScope.catalog_read, AgentScope.orders_read])).toBe(false);
    expect(asksToWrite([AgentScope.stores_write])).toBe(true);
  });
});
