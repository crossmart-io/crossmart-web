import { ActivityAction, ActivityActorType, ActivityOutcome } from '@/api/schema';
import type { ActivityEvent } from './activity.types';
import { groupByDay } from './activity-groups';

const NOW = new Date(2026, 10, 2, 15, 0);

function event(id: string, createdAt: Date): ActivityEvent {
  return {
    id,
    action: ActivityAction.product_updated,
    outcome: ActivityOutcome.SUCCEEDED,
    summary: 'Updated product',
    actor: {
      type: ActivityActorType.USER,
      userId: 'u',
      apiKeyId: null,
      agentClientId: null,
      name: 'Dana',
      email: null,
      agentName: null,
    },
    subject: null,
    itemCount: null,
    failureReason: null,
    createdAt: createdAt.toISOString(),
  };
}

describe('groupByDay', () => {
  it('groups consecutive events of the same day under one heading', () => {
    const days = groupByDay(
      [
        event('a', new Date(2026, 10, 2, 14)),
        event('b', new Date(2026, 10, 2, 9)),
        event('c', new Date(2026, 10, 1, 20)),
      ],
      NOW,
    );

    expect(days.map((day) => [day.heading, day.events.map(({ id }) => id)])).toEqual([
      ['Today', ['a', 'b']],
      ['Yesterday', ['c']],
    ]);
  });
});
