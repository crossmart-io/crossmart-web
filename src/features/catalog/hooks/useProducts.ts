import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import type {
  CatalogGap,
  ProductSort,
  ProductStatus,
  ProductStoreFilter,
  SortDirection,
} from '@/api/schema';
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

/** One numbered page of products in the chosen order. */
export function useProducts(filter: ProductsFilter, pagination: Pagination) {
  const query = usePagedList<ProductSummary>({
    endpoint: PRODUCTS_ENDPOINT,
    params: filter,
    pagination,
    fetchPage: (page, signal) => fetchProductPage(filter, page, signal),
  });
  return { ...query, products: query.items };
}
