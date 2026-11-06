import { describeSyncOutcome, inFlightCount } from './useSyncProgress';

const COUNTS = {
  listed: 38,
  pending: 0,
  failed: 0,
  removing: 0,
  removed_by_hand: 1,
  excluded: 4,
};

describe('sync outcome', () => {
  it('counts what is still being published or taken off', () => {
    expect(inFlightCount({ ...COUNTS, pending: 3, removing: 2 })).toBe(5);
  });

  it('sums up a clean sync', () => {
    expect(describeSyncOutcome(COUNTS)).toBe('38 products published');
  });

  it('names failures and what is left to send', () => {
    expect(describeSyncOutcome({ ...COUNTS, failed: 2, pending: 1 })).toBe(
      '38 products published, 2 failed, 1 still to send',
    );
  });
});
