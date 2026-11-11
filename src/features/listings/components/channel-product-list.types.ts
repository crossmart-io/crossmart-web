import type { ChannelProductSort, SortDirection } from '@/api/schema';
import type { ChannelProductCounts, ListingStore } from '../listings.types';

/** The search and sort every list of the tab shares. */
export interface ChannelProductListQuery {
  search?: string;
  sort: ChannelProductSort;
  direction: SortDirection;
}

/** What each row of the tab can do, the same in every list. */
export interface ChannelProductRowActions {
  store: ListingStore;
  canEdit: boolean;
  onOpenListing: (productId: string) => void;
  onRemove?: (productId: string) => Promise<unknown>;
  onAddBack?: (productId: string) => void;
}

/** A list tells the tab its per-state counts once they load, for the view tabs. */
export type ReportCounts = (counts: ChannelProductCounts) => void;
