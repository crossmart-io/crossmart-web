import { ListingDisplayState } from '@/api/schema';
import { MapStatus } from './channel-map.constants';
import { liveStoreCount, mapStatusCounts, mapStatusOf, storeMapStatus } from './map-status';

describe('mapStatusOf', () => {
  it.each([
    [ListingDisplayState.published, MapStatus.Published],
    [ListingDisplayState.publishing, MapStatus.Pending],
    [ListingDisplayState.ready, MapStatus.Pending],
    [ListingDisplayState.needs_details, MapStatus.Pending],
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
      [MapStatus.Pending]: 3,
      [MapStatus.Failed]: 3,
      [MapStatus.NotListed]: 10,
    });
  });
});

describe('storeMapStatus', () => {
  const counts = (published: number, pending: number, failed: number, notListed: number) => ({
    [MapStatus.Published]: published,
    [MapStatus.Pending]: pending,
    [MapStatus.Failed]: failed,
    [MapStatus.NotListed]: notListed,
  });

  it('shows the most urgent status the store has', () => {
    expect(storeMapStatus(counts(10, 2, 1, 5))).toBe(MapStatus.Failed);
    expect(storeMapStatus(counts(10, 2, 0, 5))).toBe(MapStatus.Pending);
    expect(storeMapStatus(counts(10, 0, 0, 5))).toBe(MapStatus.Published);
  });

  it('calls a store with no product in it not listed', () => {
    expect(storeMapStatus(counts(0, 0, 0, 23))).toBe(MapStatus.NotListed);
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
