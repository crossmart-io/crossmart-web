import { ChannelProductState, ChannelProductView } from '@/api/schema';
import type { FilterTab } from '@/components/lists/FilterTabs';
import {
  channelProductFilterQuery,
  type ChannelProductFilterQuery,
} from './channel-product-filter';
import {
  ALL_CHANNEL_PRODUCTS,
  type ChannelProductFilter,
  IN_STORE_STATES,
  NEEDS_DETAILS_FILTER,
} from './listings.constants';
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

/** The states of products that are not live: what the Not listed tab groups. */
const NOT_LISTED_STATES = [
  ChannelProductState.pending,
  ChannelProductState.removing,
  ChannelProductState.removed_by_hand,
  ChannelProductState.excluded,
] as const;

/** The API's view of each tab, so a tab is one request whatever states it groups. */
const STORE_LISTING_VIEW_API: Record<StoreListingView, ChannelProductView> = {
  [StoreListingView.All]: ChannelProductView.all,
  [StoreListingView.Live]: ChannelProductView.live,
  [StoreListingView.NeedsAttention]: ChannelProductView.needs_attention,
  [StoreListingView.NotListed]: ChannelProductView.not_listed,
};

/**
 * The precise filters each view is made of. An older or more specific link to one of them
 * (`?state=failed`) lists only that one, under its view's tab.
 */
export const STORE_LISTING_VIEW_FILTERS: Record<StoreListingView, readonly ChannelProductFilter[]> =
  {
    [StoreListingView.All]: [ALL_CHANNEL_PRODUCTS],
    [StoreListingView.Live]: [ChannelProductState.listed],
    [StoreListingView.NeedsAttention]: [ChannelProductState.failed, NEEDS_DETAILS_FILTER],
    [StoreListingView.NotListed]: NOT_LISTED_STATES,
  };

/** What the tab shows: a view, and what its one list asks the API for. */
export interface StoreListingSelection {
  view: StoreListingView;
  query: ChannelProductFilterQuery;
}

/** A whole view's list. Every product in the store is the API's default, so it sends nothing. */
function viewSelection(view: StoreListingView): StoreListingSelection {
  if (view === StoreListingView.All) return { view, query: {} };
  return { view, query: { view: STORE_LISTING_VIEW_API[view] } };
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
 * Reads the `state` parameter: a view lists the whole view in one request; a precise filter
 * from an older or more specific link (`?state=failed`) lists only that one, under its view's
 * tab.
 */
export function toStoreListingSelection(value: string | null): StoreListingSelection {
  if (value && isView(value)) return viewSelection(value);
  const view = value ? viewOfFilter(value) : undefined;
  const filter = view && STORE_LISTING_VIEW_FILTERS[view].find((candidate) => candidate === value);
  if (!view || !filter) return viewSelection(StoreListingView.All);
  return { view, query: channelProductFilterQuery(filter) };
}

const sum = (counts: ChannelProductCounts, states: readonly ChannelProductState[]) =>
  states.reduce((total, state) => total + counts[state], 0);

/**
 * Counts per tab, from the counts every page of the list carries. Needs attention is the API's
 * own count, as a failed product may also need details and is counted once.
 */
export function storeListingViewCounts(
  counts: ChannelProductCounts,
): Record<StoreListingView, number> {
  return {
    [StoreListingView.All]: sum(counts, IN_STORE_STATES),
    [StoreListingView.Live]: counts[ChannelProductState.listed],
    [StoreListingView.NeedsAttention]: counts.needsAttention,
    [StoreListingView.NotListed]: sum(counts, NOT_LISTED_STATES),
  };
}
