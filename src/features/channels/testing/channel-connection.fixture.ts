import {
  ChannelConnectionStatus,
  ChannelType,
  EbayCondition,
  EbayMarketplaceId,
} from '@/api/schema';
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
    missingFeatures: [],
    shopify: {
      shopName: 'Demo Store',
      currencyCode: 'USD',
      ianaTimezone: null,
      primaryDomainUrl: null,
      primaryLocation: null,
    },
    ebay: null,
    googleMerchant: null,
    etsy: null,
    falabella: null,
    productSelection: null,
    failedListings: 0,
    publishReadiness: { ready: true, missing: [] },
    pricing: null,
    connectedAt: '2026-11-03T09:00:00Z',
    disconnectedAt: null,
    lastSyncedAt: null,
    createdAt: '2026-11-03T09:00:00Z',
    updatedAt: '2026-11-03T09:00:00Z',
    ...overrides,
  };
}

/** eBay listing defaults before the merchant chose any. */
export const NO_EBAY_DEFAULTS = {
  fulfillmentPolicyId: null,
  paymentPolicyId: null,
  returnPolicyId: null,
  condition: EbayCondition.NEW,
  location: null,
  merchantLocationKey: null,
};

/** A connected eBay account on eBay UK, without business policies, with `overrides` applied. */
export function ebayConnectionFixture(
  overrides: Partial<ChannelConnection> = {},
): ChannelConnection {
  return connectionFixture({
    id: 'c-ebay',
    channel: ChannelType.ebay,
    externalAccountId: 'nY4uWx2bQ1e:EBAY_GB',
    displayName: 'demo_seller · eBay UK',
    shopify: null,
    ebay: {
      marketplaceId: EbayMarketplaceId.EBAY_GB,
      currencyCode: 'GBP',
      username: 'demo_seller',
      userId: 'nY4uWx2bQ1e',
      businessPoliciesEnabled: false,
      policies: { fulfillment: [], payment: [], return: [] },
      listingDefaults: NO_EBAY_DEFAULTS,
      readyToList: false,
    },
    ...overrides,
  });
}
