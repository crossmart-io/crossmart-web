import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import type { ChannelProductSort, ChannelProductState, SortDirection } from '@/api/schema';
import { useCursorPages } from '@/hooks/useCursorPages';
import { CHANNEL_PRODUCTS_ENDPOINT, CHANNEL_PRODUCTS_PAGE_SIZE } from '../listings.constants';
import type { ChannelProduct, ChannelProductCounts, ChannelProductPage } from '../listings.types';

export interface ChannelProductsQuery {
  state?: ChannelProductState;
  search?: string;
  sort: ChannelProductSort;
  direction: SortDirection;
}

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

/** The connection's products with their state, a page at a time, with counts per state. */
export function useChannelProducts(ref: ConnectionRef, query: ChannelProductsQuery) {
  const pages = useCursorPages<ChannelProduct, ChannelProductPage>({
    endpoint: CHANNEL_PRODUCTS_ENDPOINT,
    params: { ...ref, ...query },
    fetchPage: async (cursor, signal) => {
      const { data, error } = await fetchClient.GET(CHANNEL_PRODUCTS_ENDPOINT, {
        params: { path: ref, query: { ...query, cursor, limit: CHANNEL_PRODUCTS_PAGE_SIZE } },
        signal,
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    staleTime: 0,
    keepPreviousPages: true,
  });
  const counts: ChannelProductCounts | undefined = pages.data?.pages[0]?.counts;
  return { ...pages, counts };
}
