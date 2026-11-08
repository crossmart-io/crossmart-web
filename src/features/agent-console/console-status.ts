import { ChannelConnectionStatus } from '@/api/schema';
import { MapStatus, mapStatusCounts } from '@/features/channel-map';
import type { StoreListingHealth } from '@/features/listing-health/listing-health.types';
import { AgentState } from './agent-console.constants';

export interface StoresStatus {
  total: number;
  /** Connected, with no listing the store refused. */
  healthy: number;
  liveListings: number;
  failedListings: number;
  /** Listings waiting for the seller to add what the marketplace requires. */
  needsDetailsListings: number;
  /** The latest sync of any store; null when none synced yet. */
  lastSyncedAt: string | null;
}

function latest(left: string | null, right: string | null): string | null {
  if (!left || !right) return left ?? right;
  return Date.parse(left) >= Date.parse(right) ? left : right;
}

/** The workspace's stores at a glance, for the status bar. */
export function storesStatus(stores: readonly StoreListingHealth[]): StoresStatus {
  return stores.reduce<StoresStatus>(
    (status, store) => {
      const counts = mapStatusCounts(store.states);
      const isHealthy =
        store.status === ChannelConnectionStatus.CONNECTED && counts[MapStatus.Failed] === 0;
      return {
        total: status.total + 1,
        healthy: status.healthy + (isHealthy ? 1 : 0),
        liveListings: status.liveListings + counts[MapStatus.Published],
        failedListings: status.failedListings + counts[MapStatus.Failed],
        needsDetailsListings: status.needsDetailsListings + counts[MapStatus.NeedsDetails],
        lastSyncedAt: latest(status.lastSyncedAt, store.lastSyncedAt),
      };
    },
    {
      total: 0,
      healthy: 0,
      liveListings: 0,
      failedListings: 0,
      needsDetailsListings: 0,
      lastSyncedAt: null,
    },
  );
}

export interface AgentActivityState {
  canUse: boolean;
  isBusy: boolean;
  proposedCount: number;
}

/** Working beats waiting: a turn may run while older changes still wait. */
export function agentState({ canUse, isBusy, proposedCount }: AgentActivityState): AgentState {
  if (!canUse) return AgentState.Unavailable;
  if (isBusy) return AgentState.Running;
  return proposedCount > 0 ? AgentState.Waiting : AgentState.Idle;
}

/** Stores with listings on their way (publishing, updating, removing): their sync is not done. */
export function syncingStoreIds(stores: readonly StoreListingHealth[]): Set<string> {
  return new Set(
    stores
      .filter((store) => mapStatusCounts(store.states)[MapStatus.Pending] > 0)
      .map((store) => store.connectionId),
  );
}
