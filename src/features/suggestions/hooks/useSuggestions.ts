import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import type { SuggestionStatus } from '@/api/schema';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import { SUGGESTIONS_ENDPOINT } from '../suggestions.constants';
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
