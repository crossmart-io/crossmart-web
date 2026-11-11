import { ChannelProductState } from '@/api/schema';
import type { FilterTab } from '@/components/lists/FilterTabs';
import {
  ALL_CHANNEL_PRODUCTS,
  CHANNEL_PRODUCT_STATE_LABELS,
  type ChannelProductFilter,
  IN_STORE_STATES,
  NEEDS_DETAILS_FILTER,
} from './listings.constants';
import { LISTING_STATE_PRESENTATION } from './listing-states';
import type { ChannelProductCounts } from './listings.types';

/** The four ways a store's Listings tab can be looked at, as the seller thinks of them. */
export enum StoreListingView {
  All = 'all',
  Live = 'live',
  NeedsAttention = 'attention',
  NotListed = 'not_listed',
}

const ALL_LABEL = 'All';

export const STORE_LISTING_VIEW_TABS: readonly FilterTab<StoreListingView>[] = [
  { value: StoreListingView.All, label: ALL_LABEL },
  { value: StoreListingView.Live, label: 'Live' },
  { value: StoreListingView.NeedsAttention, label: 'Needs attention' },
  { value: StoreListingView.NotListed, label: 'Not listed' },
];

/**
 * The precise filters each view is made of, in the order its sections show. The API filters by
 * one state at a time, so a view of several lists one section per filter.
 */
export const STORE_LISTING_VIEW_FILTERS: Record<StoreListingView, readonly ChannelProductFilter[]> =
  {
    [StoreListingView.All]: [ALL_CHANNEL_PRODUCTS],
    [StoreListingView.Live]: [ChannelProductState.listed],
    [StoreListingView.NeedsAttention]: [ChannelProductState.failed, NEEDS_DETAILS_FILTER],
    [StoreListingView.NotListed]: [
      ChannelProductState.pending,
      ChannelProductState.removing,
      ChannelProductState.removed_by_hand,
      ChannelProductState.excluded,
    ],
  };

/** A section's heading: the state's own words. */
export function channelProductFilterLabel(filter: ChannelProductFilter): string {
  if (filter === ALL_CHANNEL_PRODUCTS) return ALL_LABEL;
  if (filter === NEEDS_DETAILS_FILTER) return LISTING_STATE_PRESENTATION[filter].label;
  return CHANNEL_PRODUCT_STATE_LABELS[filter];
}

/** What the tab shows: a view, and the filters it lists. */
export interface StoreListingSelection {
  view: StoreListingView;
  filters: readonly ChannelProductFilter[];
}

function isView(value: string): value is StoreListingView {
  return STORE_LISTING_VIEW_TABS.some((tab) => tab.value === value);
}

/** The view a precise filter belongs to, so a link to it lights the right tab. */
function viewOfFilter(filter: string): StoreListingView | undefined {
  return Object.values(StoreListingView).find(
    (view) =>
      view !== StoreListingView.All &&
      STORE_LISTING_VIEW_FILTERS[view].some((candidate) => candidate === filter),
  );
}

/**
 * Reads the `state` parameter: a view lists all its filters; a precise filter from an older or
 * more specific link (`?state=failed`) lists only that one, under its view's tab.
 */
export function toStoreListingSelection(value: string | null): StoreListingSelection {
  if (value && isView(value)) return { view: value, filters: STORE_LISTING_VIEW_FILTERS[value] };
  const view = value ? viewOfFilter(value) : undefined;
  if (!value || !view) {
    return {
      view: StoreListingView.All,
      filters: STORE_LISTING_VIEW_FILTERS[StoreListingView.All],
    };
  }
  const filter = STORE_LISTING_VIEW_FILTERS[view].find((candidate) => candidate === value);
  return { view, filters: filter ? [filter] : STORE_LISTING_VIEW_FILTERS[view] };
}

const sum = (counts: ChannelProductCounts, states: readonly ChannelProductState[]) =>
  states.reduce((total, state) => total + counts[state], 0);

/**
 * Counts per tab. Needs attention has none: products that need details are not counted by the
 * API, and a failed-only number would read as the whole.
 */
export function storeListingViewCounts(
  counts: ChannelProductCounts,
): Partial<Record<StoreListingView, number>> {
  return {
    [StoreListingView.All]: sum(counts, IN_STORE_STATES),
    [StoreListingView.Live]: counts[ChannelProductState.listed],
    [StoreListingView.NotListed]: sum(counts, [
      ChannelProductState.pending,
      ChannelProductState.removing,
      ChannelProductState.removed_by_hand,
      ChannelProductState.excluded,
    ]),
  };
}
