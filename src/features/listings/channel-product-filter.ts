import type { ChannelProductState, ChannelProductView, ListingDisplayState } from '@/api/schema';
import {
  ALL_CHANNEL_PRODUCTS,
  type ChannelProductFilter,
  NEEDS_DETAILS_FILTER,
} from './listings.constants';

/** What the store's products endpoint is asked for: a whole view, or one precise filter. */
export interface ChannelProductFilterQuery {
  view?: ChannelProductView;
  state?: ChannelProductState;
  displayState?: ListingDisplayState;
}

/**
 * The query a filter tab sends: nothing for every product, the display state for products that
 * need details, and the product state for the others.
 */
export function channelProductFilterQuery(filter: ChannelProductFilter): ChannelProductFilterQuery {
  if (filter === ALL_CHANNEL_PRODUCTS) return {};
  if (filter === NEEDS_DETAILS_FILTER) return { displayState: filter };
  return { state: filter };
}
