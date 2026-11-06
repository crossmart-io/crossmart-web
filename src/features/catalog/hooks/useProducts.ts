import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import {
  ListingStatus,
  type CatalogGap,
  type ProductSort,
  type ProductStatus,
  type ProductStoreFilter,
  type SortDirection,
} from '@/api/schema';
import { useInFlightPolling } from '@/hooks/useInFlightPolling';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import { PRODUCTS_ENDPOINT } from '../catalog.constants';
import type { ProductSummary } from '../catalog.types';

interface ProductsFilter {
  workspaceId: string;
  search: string;
  status: ProductStatus | undefined;
  gap: CatalogGap | undefined;
  storeFilter?: ProductStoreFilter;
  storeId?: string;
  sort: ProductSort;
  direction: SortDirection;
}

async function fetchProductPage(
  { workspaceId, search, ...filters }: ProductsFilter,
  page: { page: number; limit: number },
  signal: AbortSignal,
) {
  return unwrap(
    fetchClient.GET(PRODUCTS_ENDPOINT, {
      params: {
        path: { workspaceId },
        query: { ...filters, search: search || undefined, ...page },
      },
      signal,
    }),
  );
}

/** A store badge still publishing: the table checks again until it lands. */
function hasStorePublishing(page: { items: ProductSummary[] }): boolean {
  return page.items.some((product) =>
    product.stores.some((store) => store.status === ListingStatus.PENDING),
  );
}

/** One numbered page of products in the chosen order, refetched while a store is publishing. */
export function useProducts(filter: ProductsFilter, pagination: Pagination) {
  const refetchInterval = useInFlightPolling(hasStorePublishing);
  const query = usePagedList<ProductSummary>({
    endpoint: PRODUCTS_ENDPOINT,
    params: filter,
    pagination,
    fetchPage: (page, signal) => fetchProductPage(filter, page, signal),
    refetchInterval,
  });
  return { ...query, products: query.items };
}
