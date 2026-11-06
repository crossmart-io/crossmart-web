import { LIVE_POLLING } from '@/lib/in-flight-polling';
import { describeSyncProgress, isSettled } from './useSyncProgress';

describe('describeSyncProgress', () => {
  it('says every product went once nothing is pending or failed', () => {
    expect(describeSyncProgress({ pending: 0, failed: 0, done: true })).toBe(
      'Every product was sent.',
    );
  });

  it('names what is still to send and what failed', () => {
    expect(describeSyncProgress({ pending: 3, failed: 2, done: false })).toBe(
      '3 still to send, 2 failed',
    );
  });

  it('names failures alone once the sync is done', () => {
    expect(describeSyncProgress({ pending: 0, failed: 1, done: true })).toBe('1 failed');
  });
});

describe('isSettled', () => {
  it('keeps watching while the server says something it queued is pending', () => {
    expect(isSettled({ pending: 2, failed: 0, done: false }, 60_000)).toBe(false);
  });

  it('settles once the server says the sync is done, however soon', () => {
    expect(isSettled({ pending: 0, failed: 1, done: true }, 0)).toBe(true);
  });

  it('gives up watching after the longest live polling', () => {
    expect(isSettled({ pending: 2, failed: 0, done: false }, LIVE_POLLING.maxDurationMs)).toBe(
      true,
    );
  });
});
