import {
  ChannelConnectionStatus,
  ChannelType,
  ListingDisplayState,
  ListingSource,
  ListingStatus,
  PublishRequirement,
} from '@/api/schema';
import type {
  ListingHealthReport,
  StoreListingFailure,
  StoreListingHealth,
} from '../listing-health.types';

/** A connected Shopify store with `counts` per state, zero for the others. */
export function storeHealthFixture(
  counts: Partial<Record<ListingDisplayState, number>> = {},
  overrides: Partial<StoreListingHealth> = {},
): StoreListingHealth {
  return {
    connectionId: 'c-1',
    channel: ChannelType.shopify,
    displayName: 'North shop',
    status: ChannelConnectionStatus.CONNECTED,
    statusReason: null,
    lastSyncedAt: null,
    states: Object.values(ListingDisplayState).map((state) => ({
      state,
      count: counts[state] ?? 0,
    })),
    failedListings: counts[ListingDisplayState.failed] ?? 0,
    ...overrides,
  };
}

/** A listing the store refused for lacking item specifics. */
export function failureFixture(overrides: Partial<StoreListingFailure> = {}): StoreListingFailure {
  return {
    id: 'l-1',
    connectionId: 'c-1',
    productId: 'p-1',
    productTitle: 'Blue mug',
    imageUrl: null,
    variantCount: 1,
    status: ListingStatus.ERROR,
    source: ListingSource.RULE,
    externalId: null,
    externalUrl: null,
    lastError: 'Item specifics are missing',
    missingRequirement: PublishRequirement.item_specifics,
    lastSyncedAt: null,
    syncRequestedAt: null,
    category: null,
    displayState: ListingDisplayState.needs_details,
    displayReason: 'Item specifics are missing',
    displayRequirement: PublishRequirement.item_specifics,
    ...overrides,
  };
}

export function reportFixture(overrides: Partial<ListingHealthReport> = {}): ListingHealthReport {
  return {
    stores: [storeHealthFixture({ [ListingDisplayState.published]: 7 })],
    recentFailures: [failureFixture()],
    failedListings: 1,
    ...overrides,
  };
}
