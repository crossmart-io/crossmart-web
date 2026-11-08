import { ChannelConnectionStatus, ChannelType, ListingDisplayState } from '@/api/schema';
import type { StoreListingHealth } from '@/features/listing-health/listing-health.types';
import { AgentState } from './agent-console.constants';
import { agentState, storesStatus, syncingStoreIds } from './console-status';

function store(
  connectionId: string,
  states: Partial<Record<ListingDisplayState, number>>,
  overrides: Partial<StoreListingHealth> = {},
): StoreListingHealth {
  return {
    connectionId,
    channel: ChannelType.shopify,
    displayName: connectionId,
    status: ChannelConnectionStatus.CONNECTED,
    statusReason: null,
    lastSyncedAt: null,
    states: Object.entries(states).map(([state, count]) => ({
      state: state as ListingDisplayState,
      count,
    })),
    failedListings: states[ListingDisplayState.failed] ?? 0,
    ...overrides,
  };
}

describe('console status', () => {
  const stores = [
    store(
      'shop',
      { [ListingDisplayState.published]: 10 },
      { lastSyncedAt: '2026-11-08T09:00:00Z' },
    ),
    store('ebay', { [ListingDisplayState.published]: 4, [ListingDisplayState.failed]: 2 }),
    store(
      'etsy',
      { [ListingDisplayState.publishing]: 1 },
      { status: ChannelConnectionStatus.NEEDS_REAUTH, lastSyncedAt: '2026-11-08T10:00:00Z' },
    ),
  ];

  it('counts healthy stores, live and failed listings, and the latest sync', () => {
    expect(storesStatus(stores)).toEqual({
      total: 3,
      healthy: 1,
      liveListings: 14,
      failedListings: 2,
      lastSyncedAt: '2026-11-08T10:00:00Z',
    });
  });

  it('knows which stores still have listings on their way', () => {
    expect([...syncingStoreIds(stores)]).toEqual(['etsy']);
  });

  it('says whether the agent works, waits for approval, idles or is not offered', () => {
    expect(agentState({ canUse: true, isBusy: true, proposedCount: 2 })).toBe(AgentState.Running);
    expect(agentState({ canUse: true, isBusy: false, proposedCount: 2 })).toBe(AgentState.Waiting);
    expect(agentState({ canUse: true, isBusy: false, proposedCount: 0 })).toBe(AgentState.Idle);
    expect(agentState({ canUse: false, isBusy: false, proposedCount: 0 })).toBe(
      AgentState.Unavailable,
    );
  });
});
