import { ListingDisplayState } from '@/api/schema';
import { MapStatus } from './channel-map.constants';
import { liveStoreCount, mapStatusCounts, mapStatusOf, storeMapStatus } from './map-status';

describe('mapStatusOf', () => {
  it.each([
    [ListingDisplayState.published, MapStatus.Published],
    [ListingDisplayState.publishing, MapStatus.Pending],
    [ListingDisplayState.ready, MapStatus.Pending],
    [ListingDisplayState.needs_details, MapStatus.NeedsDetails],
    [ListingDisplayState.removing, MapStatus.Pending],
    [ListingDisplayState.failed, MapStatus.Failed],
    [ListingDisplayState.draft, MapStatus.NotListed],
    [ListingDisplayState.removed, MapStatus.NotListed],
  ])('draws %s as %s', (state, status) => {
    expect(mapStatusOf(state)).toBe(status);
  });
});

describe('mapStatusCounts', () => {
  it('adds up the states of each status', () => {
    expect(
      mapStatusCounts([
        { state: ListingDisplayState.published, count: 4 },
        { state: ListingDisplayState.publishing, count: 1 },
        { state: ListingDisplayState.needs_details, count: 2 },
        { state: ListingDisplayState.failed, count: 3 },
        { state: ListingDisplayState.draft, count: 9 },
        { state: ListingDisplayState.removed, count: 1 },
      ]),
    ).toEqual({
      [MapStatus.Published]: 4,
      [MapStatus.Pending]: 1,
      [MapStatus.NeedsDetails]: 2,
      [MapStatus.Failed]: 3,
      [MapStatus.NotListed]: 10,
    });
  });
});

describe('storeMapStatus', () => {
  const counts = ({ published = 0, pending = 0, needsDetails = 0, failed = 0, notListed = 0 }) => ({
    [MapStatus.Published]: published,
    [MapStatus.Pending]: pending,
    [MapStatus.NeedsDetails]: needsDetails,
    [MapStatus.Failed]: failed,
    [MapStatus.NotListed]: notListed,
  });

  it('shows the most urgent status the store has', () => {
    expect(storeMapStatus(counts({ published: 10, needsDetails: 2, failed: 1 }))).toBe(
      MapStatus.Failed,
    );
    expect(storeMapStatus(counts({ published: 10, pending: 3, needsDetails: 2 }))).toBe(
      MapStatus.NeedsDetails,
    );
    expect(storeMapStatus(counts({ published: 10, pending: 2, notListed: 5 }))).toBe(
      MapStatus.Pending,
    );
    expect(storeMapStatus(counts({ published: 10, notListed: 5 }))).toBe(MapStatus.Published);
  });

  it('calls a store with no product in it not listed', () => {
    expect(storeMapStatus(counts({ notListed: 23 }))).toBe(MapStatus.NotListed);
  });
});

describe('liveStoreCount', () => {
  it('counts the stores the product is published on', () => {
    expect(
      liveStoreCount([
        ListingDisplayState.published,
        ListingDisplayState.failed,
        ListingDisplayState.published,
      ]),
    ).toBe(2);
  });
});
