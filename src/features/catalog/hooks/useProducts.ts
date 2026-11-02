import { useInfiniteQuery } from '@tanstack/react-query';
import { toApiErrorMessage } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import type { ProductStatus } from '@/api/schema';
import { PRODUCTS_ENDPOINT, PRODUCTS_PAGE_SIZE } from '../catalog.constants';
import type { ProductSummary } from '../catalog.types';

/** Same key prefix as the generated query hooks, so one invalidation refreshes both. */
const HTTP_METHOD_GET = 'get';

interface ProductsFilter {
  workspaceId: string | undefined;
  search: string;
  status: ProductStatus | undefined;
}

async function fetchProductPage(
  { workspaceId, search, status }: ProductsFilter,
  cursor: string | undefined,
  signal: AbortSignal,
) {
  const { data, error } = await fetchClient.GET(PRODUCTS_ENDPOINT, {
    params: {
      path: { workspaceId: workspaceId ?? '' },
      query: { search: search || undefined, status, cursor, limit: PRODUCTS_PAGE_SIZE },
    },
    signal,
  });
  if (error) throw new Error(toApiErrorMessage(error));
  return data;
}

/**
 * Product pages in title order. The API pages by cursor, which the generated infinite-query
 * helper does not support (it starts every list at offset 0).
 */
export function useProducts(filter: ProductsFilter) {
  const query = useInfiniteQuery({
    queryKey: [HTTP_METHOD_GET, PRODUCTS_ENDPOINT, filter],
    queryFn: ({ pageParam, signal }) => fetchProductPage(filter, pageParam, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(filter.workspaceId),
  });
  const products: ProductSummary[] = query.data?.pages.flatMap((page) => page.items) ?? [];
  return { ...query, products };
}
