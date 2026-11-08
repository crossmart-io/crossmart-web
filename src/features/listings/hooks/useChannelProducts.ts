import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import type { ChannelProductSort, SortDirection } from '@/api/schema';
import { useInFlightPolling } from '@/hooks/useInFlightPolling';
import { usePagedList } from '@/hooks/usePagedList';
import type { ChannelProductFilterQuery } from '../channel-product-filter';
import { isListingInFlight } from '../listing-states';
import type { Pagination } from '@/hooks/usePagination';
import { CHANNEL_PRODUCTS_ENDPOINT } from '../listings.constants';
import type { ChannelProduct, ChannelProductCounts, ChannelProductPage } from '../listings.types';

interface ChannelProductsQuery extends ChannelProductFilterQuery {
  search?: string;
  sort: ChannelProductSort;
  direction: SortDirection;
}

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

function hasRowInFlight(page: ChannelProductPage): boolean {
  return page.items.some((row) => isListingInFlight(row.displayState));
}

/**
 * One numbered page of the connection's products with their state, and counts per state. The
 * page refetches while a row on it is publishing or being removed.
 */
export function useChannelProducts(
  ref: ConnectionRef,
  query: ChannelProductsQuery,
  pagination: Pagination,
) {
  const refetchInterval = useInFlightPolling(hasRowInFlight);
  const pages = usePagedList<ChannelProduct, ChannelProductPage>({
    endpoint: CHANNEL_PRODUCTS_ENDPOINT,
    params: { ...ref, ...query },
    pagination,
    fetchPage: (page, signal) =>
      unwrap(
        fetchClient.GET(CHANNEL_PRODUCTS_ENDPOINT, {
          params: { path: ref, query: { ...query, ...page } },
          signal,
        }),
      ),
    staleTime: 0,
    refetchInterval,
  });
  const counts: ChannelProductCounts | undefined = pages.data?.counts;
  return { ...pages, counts };
}
