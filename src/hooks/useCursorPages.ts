import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { endpointQueryKey } from '@/api/query-keys';

/** One page of a cursor-paged API list. */
interface CursorPage<TItem> {
  items: TItem[];
  /** Null or absent on the last page. */
  nextCursor?: string | null;
}

interface CursorPagesOptions<TItem, TPage extends CursorPage<TItem> = CursorPage<TItem>> {
  endpoint: string;
  /** What the list depends on, such as the workspace and the filters. A change starts over. */
  params: object;
  /** Pages may carry more than rows, such as counts; they stay on `data.pages`. */
  fetchPage: (cursor: string | undefined, signal: AbortSignal) => Promise<TPage>;
  enabled?: boolean;
  /** Milliseconds before a visit refetches; 0 for lists that change elsewhere. */
  staleTime?: number;
  /** Keep the current rows while a new filter loads, instead of flashing a skeleton. */
  keepPreviousPages?: boolean;
}

/**
 * A list the API pages by cursor, loaded a page at a time. The generated infinite-query helper
 * cannot do this (it starts every list at offset 0). Keys share the generated hooks' prefix.
 */
export function useCursorPages<TItem, TPage extends CursorPage<TItem> = CursorPage<TItem>>({
  endpoint,
  params,
  fetchPage,
  enabled,
  staleTime,
  keepPreviousPages = false,
}: CursorPagesOptions<TItem, TPage>) {
  const query = useInfiniteQuery({
    queryKey: [...endpointQueryKey(endpoint), params],
    queryFn: ({ pageParam, signal }) => fetchPage(pageParam, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled,
    staleTime,
    placeholderData: keepPreviousPages ? keepPreviousData : undefined,
  });
  const items: TItem[] = query.data?.pages.flatMap((page) => page.items) ?? [];
  return { ...query, items };
}
