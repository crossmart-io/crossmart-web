import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import type {
  CatalogGap,
  ProductSort,
  ProductStatus,
  ProductStoreFilter,
  SortDirection,
} from '@/api/schema';
import { useCursorPages } from '@/hooks/useCursorPages';
import { PRODUCTS_ENDPOINT, PRODUCTS_PAGE_SIZE } from '../catalog.constants';
import type { ProductSummary } from '../catalog.types';

interface ProductsFilter {
  workspaceId: string | undefined;
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
  cursor: string | undefined,
  signal: AbortSignal,
) {
  const { data, error } = await fetchClient.GET(PRODUCTS_ENDPOINT, {
    params: {
      path: { workspaceId: workspaceId ?? '' },
      query: { ...filters, search: search || undefined, cursor, limit: PRODUCTS_PAGE_SIZE },
    },
    signal,
  });
  if (error) throw ApiRequestError.from(error);
  return data;
}

/** Product pages in the chosen order, a page at a time (the API pages by cursor). */
export function useProducts(filter: ProductsFilter) {
  const query = useCursorPages<ProductSummary>({
    endpoint: PRODUCTS_ENDPOINT,
    params: filter,
    fetchPage: (cursor, signal) => fetchProductPage(filter, cursor, signal),
    enabled: Boolean(filter.workspaceId),
    keepPreviousPages: true,
  });
  return { ...query, products: query.items };
}
