import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import type { CatalogGap, ProductStatus } from '@/api/schema';
import { useCursorPages } from '@/hooks/useCursorPages';
import { PRODUCTS_ENDPOINT, PRODUCTS_PAGE_SIZE } from '../catalog.constants';
import type { ProductSummary } from '../catalog.types';

interface ProductsFilter {
  workspaceId: string | undefined;
  search: string;
  status: ProductStatus | undefined;
  gap: CatalogGap | undefined;
}

async function fetchProductPage(
  { workspaceId, search, status, gap }: ProductsFilter,
  cursor: string | undefined,
  signal: AbortSignal,
) {
  const { data, error } = await fetchClient.GET(PRODUCTS_ENDPOINT, {
    params: {
      path: { workspaceId: workspaceId ?? '' },
      query: { search: search || undefined, status, gap, cursor, limit: PRODUCTS_PAGE_SIZE },
    },
    signal,
  });
  if (error) throw ApiRequestError.from(error);
  return data;
}

/** Product pages in title order, a page at a time (the API pages by cursor). */
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
