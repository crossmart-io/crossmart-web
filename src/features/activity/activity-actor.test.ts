import { ActivityActorType } from '@/api/schema';
import type { ActivityActor } from './activity.types';
import { toActorName, toAgentUserName } from './activity-actor';

function actor(overrides: Partial<ActivityActor>): ActivityActor {
  return {
    type: ActivityActorType.USER,
    userId: 'user-1',
    apiKeyId: null,
    agentClientId: null,
    name: 'Dana',
    email: 'dana@example.com',
    agentName: null,
    ...overrides,
  };
}

describe('activity actor names', () => {
  it('names an agent by its own name, and the user it acted for', () => {
    const agent = actor({ type: ActivityActorType.AGENT, agentName: 'Claude', agentClientId: 'c' });
    expect(toActorName(agent)).toBe('Claude');
    expect(toAgentUserName(agent)).toBe('Dana');
  });

  it('falls back when the agent or its user is gone', () => {
    const agent = actor({ type: ActivityActorType.AGENT, name: null });
    expect(toActorName(agent)).toBe('An AI agent');
    expect(toAgentUserName(agent)).toBe('Deleted user');
  });
});
