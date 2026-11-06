import { keepPreviousData, type Query, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { endpointQueryKey } from '@/api/query-keys';
import { pageCountOf } from '@/components/lists/pagination';
import type { Pagination } from './usePagination';

/** One page of an API list that also says how many rows match in all. */
interface NumberedPage<TItem> {
  items: TItem[];
  total: number;
}

interface PagedListOptions<TPage> {
  endpoint: string;
  /** What the list depends on, such as the workspace and the filters. */
  params: object;
  pagination: Pagination;
  fetchPage: (page: { page: number; limit: number }, signal: AbortSignal) => Promise<TPage>;
  enabled?: boolean;
  /** Milliseconds before a visit refetches; 0 for lists that change elsewhere. */
  staleTime?: number;
  /** Refetches on its own, such as while rows are still being published. */
  refetchInterval?: (query: Query<TPage>) => number | false;
}

/**
 * One numbered page of an API list. The current rows stay while the next page loads, and a page
 * past the end (after rows were removed) moves back to the last one. Keys share the generated
 * hooks' prefix, so invalidating the endpoint refreshes every page.
 */
export function usePagedList<TItem, TPage extends NumberedPage<TItem> = NumberedPage<TItem>>({
  endpoint,
  params,
  pagination,
  fetchPage,
  enabled,
  staleTime,
  refetchInterval,
}: PagedListOptions<TPage>) {
  const { page, pageSize, setPage } = pagination;
  const query = useQuery({
    queryKey: [...endpointQueryKey(endpoint), params, { page, pageSize }],
    queryFn: ({ signal }) => fetchPage({ page, limit: pageSize }, signal),
    enabled,
    staleTime,
    refetchInterval,
    placeholderData: keepPreviousData,
  });
  const total = query.data?.total ?? 0;
  const pageCount = pageCountOf(total, pageSize);
  const isPastEnd = query.isSuccess && !query.isPlaceholderData && page > pageCount;
  useEffect(() => {
    if (isPastEnd) setPage(pageCount);
  }, [isPastEnd, pageCount, setPage]);
  const items: TItem[] = query.data?.items ?? [];
  return { ...query, items, total, pageCount };
}
