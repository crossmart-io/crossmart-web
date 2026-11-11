import { AttentionStoreReason, ListingDisplayState } from '@/api/schema';
import {
  ReviewSource,
  toAgentReviewRoute,
  toProductStoreOverrideRoute,
  toStoreRoute,
} from '@/config/routes';
import { listingFixOf, listingFixRoute } from '@/features/listings/listing-fix';
import { ATTENTION_COPY, STORE_REASON_COPY } from './attention.constants';
import {
  type AttentionCounts,
  AttentionKind,
  type AttentionListing,
  type AttentionRow,
  type AttentionStore,
  type AttentionSummary,
} from './attention.types';

export const NO_ATTENTION: AttentionCounts = {
  stores: 0,
  listings: 0,
  proposals: 0,
  suggestions: 0,
  total: 0,
};

/** The summary's counts, with 0 for the sections the person may not see. */
export function attentionCounts(summary: AttentionSummary | undefined): AttentionCounts {
  if (!summary) return NO_ATTENTION;
  return {
    stores: summary.stores?.count ?? 0,
    listings: summary.listings?.count ?? 0,
    proposals: summary.proposals?.count ?? 0,
    suggestions: summary.suggestions?.count ?? 0,
    total: summary.total,
  };
}

function storeRow(store: AttentionStore): AttentionRow {
  const canReconnect = store.reason !== AttentionStoreReason.disconnected_with_listings;
  return {
    key: `store:${store.connectionId}`,
    kind: AttentionKind.Store,
    title: store.displayName,
    detail: store.statusReason ?? STORE_REASON_COPY[store.reason],
    to: toStoreRoute(store.connectionId),
    action: canReconnect ? ATTENTION_COPY.reconnect : ATTENTION_COPY.openStore,
    channel: store.channel,
  };
}

/**
 * A product the store refused. When the store said what it lacks, the row links to where that
 * is added; otherwise to the product's listing on that store, which shows the error and a retry.
 */
function listingRow(listing: AttentionListing): AttentionRow {
  const ref = { productId: listing.productId, connectionId: listing.connectionId };
  const fix = listingFixOf({
    displayState: ListingDisplayState.failed,
    displayRequirement: null,
    missingRequirement: listing.missingRequirement,
  });
  const problem = fix?.missing ?? listing.lastError ?? ATTENTION_COPY.failedFallback;
  return {
    key: `listing:${listing.productId}:${listing.connectionId}`,
    kind: AttentionKind.Listing,
    title: listing.productTitle,
    detail: `${listing.storeName}: ${problem}`,
    to: fix
      ? listingFixRoute(fix, ref)
      : toProductStoreOverrideRoute(listing.productId, listing.connectionId),
    action: fix?.action ?? ATTENTION_COPY.fix,
    channel: listing.channel,
    imageUrl: listing.imageUrl,
  };
}

function reviewRow(source: ReviewSource, title: string): AttentionRow {
  return {
    key: `review:${source}`,
    kind: AttentionKind.Review,
    title,
    detail: ATTENTION_COPY.waitingForYou,
    to: toAgentReviewRoute(source),
    action: ATTENTION_COPY.review,
  };
}

/** Everything to act on, the most blocking first: stores, then listings, then reviews. */
export function attentionRows(summary: AttentionSummary): AttentionRow[] {
  const counts = attentionCounts(summary);
  const rows = [
    ...(summary.stores?.items ?? []).map(storeRow),
    ...(summary.listings?.items ?? []).map(listingRow),
  ];
  if (counts.proposals > 0) {
    rows.push(reviewRow(ReviewSource.Proposals, ATTENTION_COPY.proposals(counts.proposals)));
  }
  if (counts.suggestions > 0) {
    rows.push(reviewRow(ReviewSource.Suggestions, ATTENTION_COPY.suggestions(counts.suggestions)));
  }
  return rows;
}

/** Failed listings beyond those the rows show, as each row may stand for several. */
export function hiddenFailedListings(summary: AttentionSummary): number {
  const listings = summary.listings;
  if (!listings) return 0;
  const shown = listings.items.reduce((sum, item) => sum + item.failedListings, 0);
  return Math.max(listings.count - shown, 0);
}

/** Stores beyond those listed. */
export function hiddenStores(summary: AttentionSummary): number {
  const stores = summary.stores;
  return stores ? Math.max(stores.count - stores.items.length, 0) : 0;
}
