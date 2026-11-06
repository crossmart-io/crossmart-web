import { ListingDisplayState } from '@/api/schema';

export const LISTING_HEALTH_ENDPOINT = '/api/v1/workspaces/{workspaceId}/analytics/listings';

/**
 * The parts of a store's bar. Status colors are reserved for the states they mean (published,
 * needs details, failed); the states in motion share one neutral fill. Each part is listed beside
 * the bar with its icon, label and count, so color is never the only cue.
 */
export enum StateGroup {
  Published = 'published',
  InProgress = 'in_progress',
  NeedsDetails = 'needs_details',
  Failed = 'failed',
}

export const STATE_GROUP_ORDER: readonly StateGroup[] = [
  StateGroup.Published,
  StateGroup.InProgress,
  StateGroup.NeedsDetails,
  StateGroup.Failed,
];

export const STATE_GROUP_FILLS: Record<StateGroup, string> = {
  [StateGroup.Published]: 'bg-success',
  [StateGroup.InProgress]: 'bg-muted-foreground/40',
  [StateGroup.NeedsDetails]: 'bg-warning',
  [StateGroup.Failed]: 'bg-destructive',
};

/** The states of products in the store, by the bar part they fill. */
export const STATE_GROUP_MEMBERS: Record<StateGroup, readonly ListingDisplayState[]> = {
  [StateGroup.Published]: [ListingDisplayState.published],
  [StateGroup.InProgress]: [
    ListingDisplayState.ready,
    ListingDisplayState.publishing,
    ListingDisplayState.removing,
  ],
  [StateGroup.NeedsDetails]: [ListingDisplayState.needs_details],
  [StateGroup.Failed]: [ListingDisplayState.failed],
};

/** States of catalog products that are not in the store: counted apart, not on the bar. */
export const OUT_OF_STORE_STATES: readonly ListingDisplayState[] = [
  ListingDisplayState.draft,
  ListingDisplayState.removed,
];

export const LISTING_HEALTH_COPY = {
  heading: 'Listings',
  loadError: 'Listings could not be loaded.',
  storesTitle: 'Stores',
  storesDescription: 'Where your products stand on each store.',
  noStores: 'to list your products on it.',
  connectStore: 'Connect a store',
  emptyStore: 'No products in this store yet.',
  outOfStore: (draft: number, removed: number) =>
    `Not in the store: ${draft.toLocaleString()} draft · ${removed.toLocaleString()} removed`,
  failuresTitle: 'Needs attention',
  failuresDescription: 'The latest listings a store refused, and how to fix them.',
  noFailures: 'No listing failed on any store.',
  moreFailures: (total: number) => `${total.toLocaleString()} failed in all`,
  synced: 'Synced',
  neverSynced: 'never',
} as const;
