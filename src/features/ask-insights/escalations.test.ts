import { AskEscalationStatus } from '@/api/schema';
import { CallbackState } from './ask-insights.types';
import { callbackStateOf, openFirst } from './escalations';
import { escalationFixture } from './testing/ask-insights.fixture';

describe('openFirst', () => {
  it('puts open escalations first and keeps the order within each status', () => {
    const replied = escalationFixture({ id: 'a', status: AskEscalationStatus.replied });
    const openNew = escalationFixture({ id: 'b' });
    const openOld = escalationFixture({ id: 'c' });
    expect(openFirst([replied, openNew, openOld]).map(({ id }) => id)).toEqual(['b', 'c', 'a']);
  });
});

describe('callbackStateOf', () => {
  const callbackUrl = 'https://agent.example.com/reply';

  it('tells delivered, failed and pending callbacks apart', () => {
    expect(callbackStateOf(escalationFixture())).toBe(CallbackState.None);
    expect(callbackStateOf(escalationFixture({ callbackUrl }))).toBe(CallbackState.Pending);
    expect(callbackStateOf(escalationFixture({ callbackUrl, callbackError: 'HTTP 500' }))).toBe(
      CallbackState.Failed,
    );
    expect(
      callbackStateOf(escalationFixture({ callbackUrl, callbackDeliveredAt: '2026-11-06T11:00Z' })),
    ).toBe(CallbackState.Delivered);
  });
});
