import type { ListingDisplayState } from '@/api/schema';
import {
  MAP_STATUS_MEMBERS,
  MAP_STATUS_ORDER,
  MAP_STATUS_SEVERITY,
  MapStatus,
} from './channel-map.constants';

/** The map status a listing state belongs to. */
export function mapStatusOf(state: ListingDisplayState): MapStatus {
  return (
    MAP_STATUS_ORDER.find((status) => MAP_STATUS_MEMBERS[status].includes(state)) ??
    MapStatus.NotListed
  );
}

export type MapStatusCounts = Record<MapStatus, number>;

/** How many products a store has in each map status, from its counts per listing state. */
export function mapStatusCounts(
  states: readonly { state: ListingDisplayState; count: number }[],
): MapStatusCounts {
  const counts = Object.fromEntries(
    MAP_STATUS_ORDER.map((status) => [status, 0]),
  ) as MapStatusCounts;
  for (const { state, count } of states) counts[mapStatusOf(state)] += count;
  return counts;
}

/**
 * The status a store's edge shows: the most urgent one among the products it has. A store with
 * no product in it at all is not listed.
 */
export function storeMapStatus(counts: MapStatusCounts): MapStatus {
  return (
    MAP_STATUS_SEVERITY.find((status) => status !== MapStatus.NotListed && counts[status] > 0) ??
    MapStatus.NotListed
  );
}

/** How many of the stores have the product live. */
export function liveStoreCount(states: readonly ListingDisplayState[]): number {
  return states.filter((state) => mapStatusOf(state) === MapStatus.Published).length;
}
