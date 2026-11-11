import type { ChannelType, components } from '@/api/schema';

export type AttentionSummary = components['schemas']['AttentionSummaryDto'];
export type AttentionStore = components['schemas']['AttentionStoreDto'];
export type AttentionListing = components['schemas']['AttentionListingGroupDto'];

/** What a row on Home is about, which decides its picture. */
export enum AttentionKind {
  Store = 'store',
  Listing = 'listing',
  Review = 'review',
}

/** One thing to act on, with where it is fixed. */
export interface AttentionRow {
  key: string;
  kind: AttentionKind;
  title: string;
  detail: string;
  /** The page where it is fixed. */
  to: string;
  action: string;
  channel?: ChannelType;
  imageUrl?: string | null;
}

/** Counts per section, 0 for sections the person may not see. */
export interface AttentionCounts {
  stores: number;
  listings: number;
  proposals: number;
  suggestions: number;
  total: number;
}
