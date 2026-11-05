import { unwrap } from '@/api/unwrap';
import { api, fetchClient } from '@/api/client';
import { SuggestionStatus } from '@/api/schema';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import { PENDING_COUNT_REFRESH_MS, SUGGESTIONS_ENDPOINT } from '../suggestions.constants';
import type { Suggestion } from '../suggestions.types';

interface SuggestionFilter {
  workspaceId: string;
  status: SuggestionStatus;
}

async function fetchSuggestionPage(
  { workspaceId, status }: SuggestionFilter,
  page: { page: number; limit: number },
  signal: AbortSignal,
) {
  return unwrap(
    fetchClient.GET(SUGGESTIONS_ENDPOINT, {
      params: { path: { workspaceId }, query: { status, ...page } },
      signal,
    }),
  );
}

/** One numbered page of suggestions with a status, newest first. Refetched on each visit. */
export function useSuggestions(filter: SuggestionFilter, pagination: Pagination) {
  const query = usePagedList<Suggestion>({
    endpoint: SUGGESTIONS_ENDPOINT,
    params: filter,
    pagination,
    fetchPage: (page, signal) => fetchSuggestionPage(filter, page, signal),
    staleTime: 0,
  });
  return { ...query, suggestions: query.items };
}

/** How many suggestions wait for review, for the sidebar. Polled, as agents add to it. */
export function usePendingSuggestionCount(workspaceId: string | undefined) {
  const query = api.useQuery(
    'get',
    SUGGESTIONS_ENDPOINT,
    {
      params: {
        path: { workspaceId: workspaceId ?? '' },
        query: { status: SuggestionStatus.PENDING, limit: 1 },
      },
    },
    { enabled: Boolean(workspaceId), refetchInterval: PENDING_COUNT_REFRESH_MS },
  );
  return query.data?.total ?? 0;
}
