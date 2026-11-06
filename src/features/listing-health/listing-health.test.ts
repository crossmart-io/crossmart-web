import { ListingDisplayState } from '@/api/schema';
import { summarizeStore } from './listing-health';
import { StateGroup } from './listing-health.constants';
import { storeHealthFixture } from './testing/listing-health.fixture';

describe('summarizeStore', () => {
  it('groups the in-store states and leaves drafts and removed products out', () => {
    const summary = summarizeStore(
      storeHealthFixture({
        [ListingDisplayState.published]: 10,
        [ListingDisplayState.ready]: 1,
        [ListingDisplayState.publishing]: 2,
        [ListingDisplayState.needs_details]: 3,
        [ListingDisplayState.failed]: 4,
        [ListingDisplayState.draft]: 50,
        [ListingDisplayState.removed]: 5,
      }),
    );
    expect(summary.groups).toEqual({
      [StateGroup.Published]: 10,
      [StateGroup.InProgress]: 3,
      [StateGroup.NeedsDetails]: 3,
      [StateGroup.Failed]: 4,
    });
    expect(summary.inStore).toBe(20);
    expect(summary.counts[ListingDisplayState.draft]).toBe(50);
  });
});
