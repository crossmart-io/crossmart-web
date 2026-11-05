import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import type { ChannelProductSort, ChannelProductState, SortDirection } from '@/api/schema';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import { CHANNEL_PRODUCTS_ENDPOINT } from '../listings.constants';
import type { ChannelProduct, ChannelProductCounts, ChannelProductPage } from '../listings.types';

interface ChannelProductsQuery {
  state?: ChannelProductState;
  search?: string;
  sort: ChannelProductSort;
  direction: SortDirection;
}

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

/** One numbered page of the connection's products with their state, and counts per state. */
export function useChannelProducts(
  ref: ConnectionRef,
  query: ChannelProductsQuery,
  pagination: Pagination,
) {
  const pages = usePagedList<ChannelProduct, ChannelProductPage>({
    endpoint: CHANNEL_PRODUCTS_ENDPOINT,
    params: { ...ref, ...query },
    pagination,
    fetchPage: async (page, signal) => {
      const { data, error } = await fetchClient.GET(CHANNEL_PRODUCTS_ENDPOINT, {
        params: { path: ref, query: { ...query, ...page } },
        signal,
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    staleTime: 0,
  });
  const counts: ChannelProductCounts | undefined = pages.data?.counts;
  return { ...pages, counts };
}
