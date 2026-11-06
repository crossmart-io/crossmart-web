import {
  ChannelType,
  ListingDisplayState,
  ListingSource,
  ListingStatus,
  ProductStatus,
} from '@/api/schema';
import type { ProductSummary } from '../catalog.types';
import { hasStorePublishing } from './useProducts';

function pageWith(displayState: ListingDisplayState): { items: ProductSummary[] } {
  return {
    items: [
      {
        id: 'p-1',
        handle: 'mug',
        title: 'Mug',
        status: ProductStatus.ACTIVE,
        vendor: null,
        productType: null,
        variantCount: 1,
        totalAvailable: 1,
        priceRange: null,
        imageUrl: null,
        updatedAt: '2026-11-06T09:00:00Z',
        stores: [
          {
            connectionId: 'c-1',
            channel: ChannelType.ebay,
            storeName: 'eBay',
            status: ListingStatus.PENDING,
            source: ListingSource.MANUAL,
            displayState,
            displayReason: null,
            displayRequirement: null,
          },
        ],
      },
    ],
  };
}

describe('hasStorePublishing', () => {
  it.each([[ListingDisplayState.publishing], [ListingDisplayState.removing]])(
    'keeps checking a store badge that is %s',
    (state) => {
      expect(hasStorePublishing(pageWith(state))).toBe(true);
    },
  );

  it.each([[ListingDisplayState.needs_details], [ListingDisplayState.ready]])(
    'stops checking a pending badge that is %s, which waits on the merchant',
    (state) => {
      expect(hasStorePublishing(pageWith(state))).toBe(false);
    },
  );
});
