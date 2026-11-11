import { ChannelProductState, ChannelProductView, ListingDisplayState } from '@/api/schema';
import { NEEDS_DETAILS_FILTER } from './listings.constants';
import type { ChannelProductCounts } from './listings.types';
import {
  StoreListingView,
  storeListingViewCounts,
  toStoreListingSelection,
} from './store-listing-views';

describe('toStoreListingSelection', () => {
  it('opens on every product in the store without a state', () => {
    expect(toStoreListingSelection(null)).toEqual({ view: StoreListingView.All, query: {} });
  });

  it.each([
    [StoreListingView.Live, ChannelProductView.live],
    [StoreListingView.NeedsAttention, ChannelProductView.needs_attention],
    [StoreListingView.NotListed, ChannelProductView.not_listed],
  ])('lists the %s tab in one request for the API’s %s view', (view, apiView) => {
    expect(toStoreListingSelection(view)).toEqual({ view, query: { view: apiView } });
  });

  it.each([
    [ChannelProductState.listed, StoreListingView.Live],
    [ChannelProductState.failed, StoreListingView.NeedsAttention],
    [ChannelProductState.pending, StoreListingView.NotListed],
    [ChannelProductState.removed_by_hand, StoreListingView.NotListed],
  ])('keeps an older link to %s precise, under the %s tab', (state, view) => {
    expect(toStoreListingSelection(state)).toEqual({ view, query: { state } });
  });

  it('keeps an older link to the products that need details, under Needs attention', () => {
    expect(toStoreListingSelection(NEEDS_DETAILS_FILTER)).toEqual({
      view: StoreListingView.NeedsAttention,
      query: { displayState: ListingDisplayState.needs_details },
    });
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
    needsDetails: 2,
    needsAttention: 2,
  };

  it('counts every tab, Needs attention from the API’s own count', () => {
    expect(storeListingViewCounts(counts)).toEqual({
      [StoreListingView.All]: 9,
      [StoreListingView.Live]: 5,
      [StoreListingView.NeedsAttention]: 2,
      [StoreListingView.NotListed]: 16,
    });
  });
});
