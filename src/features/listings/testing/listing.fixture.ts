import {
  ChannelConnectionStatus,
  ChannelType,
  ListingDisplayState,
  ListingSource,
  ListingStatus,
  OutOfStockPolicy,
  PriceSource,
  ProductStatus,
} from '@/api/schema';
import type {
  ChannelVariant,
  ListingOverrideView,
  Product,
  ProductChannel,
} from '../listings.types';

type ListingSummary = NonNullable<ProductChannel['listing']>;
type ProductVariant = Product['variants'][number];

export function productVariantFixture(overrides: Partial<ProductVariant> = {}): ProductVariant {
  return {
    id: 'v-1',
    position: 0,
    sku: null,
    barcode: null,
    optionValues: ['Blue'],
    price: '64.00',
    compareAtPrice: '80.00',
    cost: null,
    weightGrams: null,
    requiresShipping: true,
    taxable: true,
    outOfStockPolicy: OutOfStockPolicy.STOP_SELLING,
    tracked: true,
    available: 4,
    ...overrides,
  };
}

export function productFixture(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p-1',
    handle: 'linen-shirt',
    title: 'Linen shirt',
    descriptionHtml: '<p>Soft washed linen.</p>',
    vendor: null,
    productType: null,
    tags: ['linen', 'summer'],
    status: ProductStatus.ACTIVE,
    optionNames: ['Color'],
    variants: [productVariantFixture()],
    media: [{ id: 'm-1', url: 'https://cdn.example.com/a.jpg', altText: null, position: 0 }],
    createdAt: '2026-11-01T09:00:00Z',
    updatedAt: '2026-11-01T09:00:00Z',
    ...overrides,
  };
}

export function channelVariantFixture(overrides: Partial<ChannelVariant> = {}): ChannelVariant {
  return {
    variantId: 'v-1',
    title: 'Blue',
    quantity: 4,
    price: {
      price: '64.00',
      compareAtPrice: '80.00',
      source: PriceSource.base,
      steps: [],
      explanation: 'base price = $64.00',
      warnings: [],
      unitCost: null,
    },
    ...overrides,
  };
}

export function listingFixture(overrides: Partial<ListingSummary> = {}): ListingSummary {
  return {
    id: 'l-1',
    status: ListingStatus.ACTIVE,
    source: ListingSource.MANUAL,
    externalId: 'gid://shopify/Product/1',
    externalUrl: 'https://demo.example.com/products/linen-shirt',
    lastError: null,
    missingRequirement: null,
    lastSyncedAt: null,
    category: null,
    ...overrides,
  };
}

export function overrideFixture(overrides: Partial<ListingOverrideView> = {}): ListingOverrideView {
  return {
    title: null,
    descriptionHtml: null,
    tags: null,
    mediaUrls: null,
    visibility: null,
    inventoryBuffer: null,
    maxQuantity: null,
    variantPrices: [],
    updatedAt: '2026-11-03T09:00:00Z',
    ...overrides,
  };
}

export function productChannelFixture(overrides: Partial<ProductChannel> = {}): ProductChannel {
  return {
    connection: {
      id: 'c-1',
      channel: ChannelType.shopify,
      displayName: 'crossmartstore',
      status: ChannelConnectionStatus.CONNECTED,
      currencyCode: 'USD',
    },
    selected: true,
    displayState: ListingDisplayState.published,
    displayReason: null,
    listing: listingFixture(),
    override: null,
    variants: [channelVariantFixture()],
    ...overrides,
  };
}
