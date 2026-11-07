import {
  ChannelConnectionStatus,
  ChannelType,
  ListingDisplayState,
  ListingSource,
  ListingStatus,
  ListingVisibility,
  PriceSource,
} from '@/api/schema';
import type {
  ChannelVariant,
  ListingEditor,
  ListingEditorVariant,
  ProductChannel,
} from '../listings.types';

type ListingSummary = NonNullable<ProductChannel['listing']>;
export function channelVariantFixture(overrides: Partial<ChannelVariant> = {}): ChannelVariant {
  return {
    variantId: 'v-1',
    title: 'Blue',
    quantity: 4,
    rulePrice: '64.00',
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
    syncRequestedAt: null,
    category: null,
    ...overrides,
  };
}

export function productChannelFixture(overrides: Partial<ProductChannel> = {}): ProductChannel {
  return {
    connection: {
      id: 'c-1',
      channel: ChannelType.shopify,
      displayName: 'demo-store',
      status: ChannelConnectionStatus.CONNECTED,
      currencyCode: 'USD',
    },
    selected: true,
    displayState: ListingDisplayState.published,
    displayReason: null,
    displayRequirement: null,
    listing: listingFixture(),
    override: null,
    variants: [channelVariantFixture()],
    ...overrides,
  };
}

/** A field that follows the product: no override, the product's value is the result. */
function inherited<TValue>(product: TValue) {
  return { product, override: null, effective: product, overridden: false };
}

/** A field the store changes: the override is the result. */
export function overridden<TValue>(product: TValue, override: TValue) {
  return { product, override, effective: override, overridden: true };
}

export function listingEditorVariantFixture(
  overrides: Partial<ListingEditorVariant> = {},
): ListingEditorVariant {
  return {
    variantId: 'v-1',
    title: 'Blue',
    sku: null,
    price: { product: '64.00', override: null, effective: '64.00', overridden: false },
    compareAtPrice: { product: '80.00', override: null, effective: '80.00', overridden: false },
    rulePrice: '64.00',
    resolvedPrice: channelVariantFixture().price,
    quantity: 4,
    ...overrides,
  };
}

/** Linen shirt in demo-store, following the product everywhere, with `overrides` applied. */
export function listingEditorFixture(overrides: Partial<ListingEditor> = {}): ListingEditor {
  const channel = productChannelFixture();
  return {
    productId: 'p-1',
    connection: channel.connection,
    selected: true,
    displayState: ListingDisplayState.published,
    displayReason: null,
    displayRequirement: null,
    listing: listingFixture(),
    title: inherited('Linen shirt'),
    vendor: inherited<string | null>('Northfield'),
    descriptionHtml: inherited('<p>Soft washed linen.</p>'),
    tags: inherited(['linen', 'summer']),
    images: inherited(['https://cdn.example.com/a.jpg']),
    visibility: inherited(ListingVisibility.VISIBLE),
    stock: { inventoryBuffer: null, maxQuantity: null },
    variants: [listingEditorVariantFixture()],
    category: { supported: false, value: null },
    itemSpecifics: { supported: false, count: 0, names: [] },
    overrideUpdatedAt: null,
    ...overrides,
  };
}
