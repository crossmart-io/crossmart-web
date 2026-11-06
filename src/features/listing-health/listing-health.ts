import type { ListingDisplayState } from '@/api/schema';
import {
  STATE_GROUP_MEMBERS,
  STATE_GROUP_ORDER,
  type StateGroup,
} from './listing-health.constants';
import type { StoreListingHealth } from './listing-health.types';

export interface StoreStateSummary {
  /** Products in the store, per bar part. */
  groups: Record<StateGroup, number>;
  /** Products in the store, every state counted once. */
  inStore: number;
  counts: Record<ListingDisplayState, number>;
}

function countsOf(store: StoreListingHealth): Record<ListingDisplayState, number> {
  return Object.fromEntries(store.states.map(({ state, count }) => [state, count])) as Record<
    ListingDisplayState,
    number
  >;
}

/** A store's counts per state and per bar part; drafts and removed products are not in it. */
export function summarizeStore(store: StoreListingHealth): StoreStateSummary {
  const counts = countsOf(store);
  const sum = (states: readonly ListingDisplayState[]) =>
    states.reduce((total, state) => total + (counts[state] ?? 0), 0);
  const groups = Object.fromEntries(
    STATE_GROUP_ORDER.map((group) => [group, sum(STATE_GROUP_MEMBERS[group])]),
  ) as Record<StateGroup, number>;
  const inStore = STATE_GROUP_ORDER.reduce((total, group) => total + groups[group], 0);
  return { groups, inStore, counts };
}
