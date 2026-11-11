import { ChannelProductState } from '@/api/schema';
import { ALL_CHANNEL_PRODUCTS, NEEDS_DETAILS_FILTER } from './listings.constants';
import type { ChannelProductCounts } from './listings.types';
import {
  StoreListingView,
  storeListingViewCounts,
  toStoreListingSelection,
} from './store-listing-views';

describe('toStoreListingSelection', () => {
  it('opens on every product in the store without a state', () => {
    expect(toStoreListingSelection(null)).toEqual({
      view: StoreListingView.All,
      filters: [ALL_CHANNEL_PRODUCTS],
    });
  });

  it('lists each state of a view', () => {
    expect(toStoreListingSelection(StoreListingView.NeedsAttention)).toEqual({
      view: StoreListingView.NeedsAttention,
      filters: [ChannelProductState.failed, NEEDS_DETAILS_FILTER],
    });
  });

  it.each([
    [ChannelProductState.listed, StoreListingView.Live],
    [ChannelProductState.failed, StoreListingView.NeedsAttention],
    [NEEDS_DETAILS_FILTER, StoreListingView.NeedsAttention],
    [ChannelProductState.pending, StoreListingView.NotListed],
    [ChannelProductState.removed_by_hand, StoreListingView.NotListed],
  ])('keeps an older link to %s precise, under the %s tab', (state, view) => {
    expect(toStoreListingSelection(state)).toEqual({ view, filters: [state] });
  });

  it('falls back to every product for an unknown state', () => {
    expect(toStoreListingSelection('nonsense').view).toBe(StoreListingView.All);
  });
});

describe('storeListingViewCounts', () => {
  const counts: ChannelProductCounts = {
    listed: 5,
    pending: 2,
    failed: 1,
    removing: 1,
    removed_by_hand: 3,
    excluded: 10,
  };

  it('sums the states each view lists, and leaves out the count it cannot know', () => {
    expect(storeListingViewCounts(counts)).toEqual({
      [StoreListingView.All]: 9,
      [StoreListingView.Live]: 5,
      [StoreListingView.NotListed]: 16,
    });
  });
});
