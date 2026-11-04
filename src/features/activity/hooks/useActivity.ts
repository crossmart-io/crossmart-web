import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import type { ActivityAction, ActivityOutcome, SortDirection } from '@/api/schema';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import { ACTIVITY_ENDPOINT } from '../activity.constants';
import type { ActivityEvent } from '../activity.types';

interface ActivityFilter {
  workspaceId: string;
  action: ActivityAction | undefined;
  outcome: ActivityOutcome | undefined;
  direction: SortDirection;
}

async function fetchActivityPage(
  { workspaceId, action, outcome, direction }: ActivityFilter,
  page: { page: number; limit: number },
  signal: AbortSignal,
) {
  const { data, error } = await fetchClient.GET(ACTIVITY_ENDPOINT, {
    params: {
      path: { workspaceId },
      query: { action, outcome, direction, ...page },
    },
    signal,
  });
  if (error) throw ApiRequestError.from(error);
  return data;
}

/** One numbered page of the workspace log, newest first. Refetched when the page opens. */
export function useActivity(filter: ActivityFilter, pagination: Pagination) {
  const query = usePagedList<ActivityEvent>({
    endpoint: ACTIVITY_ENDPOINT,
    params: filter,
    pagination,
    fetchPage: (page, signal) => fetchActivityPage(filter, page, signal),
    staleTime: 0,
  });
  return { ...query, events: query.items };
}
