import { ChannelConnectionStatus, ChannelType } from '@/api/schema';
import type { ChannelConnection } from '../channels.types';

/** A connected Shopify store, with `overrides` applied. */
export function connectionFixture(overrides: Partial<ChannelConnection> = {}): ChannelConnection {
  return {
    id: 'c-1',
    channel: ChannelType.shopify,
    externalAccountId: 'demo-store.myshopify.com',
    displayName: 'Demo Store',
    status: ChannelConnectionStatus.CONNECTED,
    statusReason: null,
    grantedScopes: [],
    shopify: {
      shopName: 'Demo Store',
      currencyCode: 'USD',
      ianaTimezone: null,
      primaryDomainUrl: null,
      primaryLocation: null,
    },
    productSelection: null,
    failedListings: 0,
    pricing: null,
    connectedAt: '2026-11-03T09:00:00Z',
    disconnectedAt: null,
    lastSyncedAt: null,
    createdAt: '2026-11-03T09:00:00Z',
    updatedAt: '2026-11-03T09:00:00Z',
    ...overrides,
  };
}
