import {
  AttentionStoreReason,
  ChannelConnectionStatus,
  ChannelType,
  PublishRequirement,
} from '@/api/schema';
import {
  ReviewSource,
  toAgentReviewRoute,
  toProductStoreOverrideRoute,
  toStoreRoute,
} from '@/config/routes';
import {
  attentionCounts,
  attentionRows,
  hiddenFailedListings,
  hiddenStores,
} from './attention-rows';
import { ATTENTION_COPY } from './attention.constants';
import type { AttentionListing, AttentionSummary } from './attention.types';

const LISTING: AttentionListing = {
  productId: 'p-1',
  productTitle: 'Vintage denim jacket',
  imageUrl: null,
  connectionId: 'c-2',
  channel: ChannelType.ebay,
  storeName: 'eBay US',
  failedListings: 1,
  lastError: 'Item specifics missing',
  missingRequirement: null,
  updatedAt: '2026-11-10T00:00:00Z',
};

const SUMMARY: AttentionSummary = {
  total: 9,
  stores: {
    count: 2,
    items: [
      {
        connectionId: 'c-1',
        channel: ChannelType.shopify,
        displayName: 'Main shop',
        status: ChannelConnectionStatus.NEEDS_REAUTH,
        statusReason: null,
        reason: AttentionStoreReason.needs_reauth,
        liveListings: 3,
      },
    ],
  },
  listings: {
    count: 4,
    items: [
      LISTING,
      { ...LISTING, productId: 'p-2', missingRequirement: PublishRequirement.category },
    ],
  },
  proposals: { count: 1, items: [] },
  suggestions: { count: 2, items: [] },
};

describe('attentionRows', () => {
  const rows = attentionRows(SUMMARY);

  it('lists stores first, then listings, then one row per review source', () => {
    expect(rows.map((row) => row.key)).toEqual([
      'store:c-1',
      'listing:p-1:c-2',
      'listing:p-2:c-2',
      `review:${ReviewSource.Proposals}`,
      `review:${ReviewSource.Suggestions}`,
    ]);
  });

  it('sends a store to its page to reconnect', () => {
    expect(rows[0]).toMatchObject({ to: toStoreRoute('c-1'), action: ATTENTION_COPY.reconnect });
  });

  it('opens the listing on its store, or the fix the store asked for', () => {
    expect(rows[1]).toMatchObject({
      to: toProductStoreOverrideRoute('p-1', 'c-2'),
      detail: 'eBay US: Item specifics missing',
    });
    expect(rows[2]).toMatchObject({
      to: toProductStoreOverrideRoute('p-2', 'c-2'),
      action: 'Choose a category',
    });
  });

  it('links reviews to their source in Agent › Review', () => {
    expect(rows[4]).toMatchObject({ to: toAgentReviewRoute(ReviewSource.Suggestions) });
  });
});

describe('attention counts', () => {
  it('reads 0 for sections the person may not see', () => {
    expect(attentionCounts({ ...SUMMARY, proposals: null, total: 8 })).toMatchObject({
      proposals: 0,
      total: 8,
    });
  });

  it('counts what the rows leave out', () => {
    expect(hiddenStores(SUMMARY)).toBe(1);
    expect(hiddenFailedListings(SUMMARY)).toBe(2);
  });
});
