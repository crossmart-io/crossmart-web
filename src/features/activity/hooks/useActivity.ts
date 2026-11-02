import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import type { ActivityAction, ActivityOutcome } from '@/api/schema';
import { ACTIVITY_ENDPOINT, ACTIVITY_PAGE_SIZE } from '../activity.constants';
import type { ActivityEvent } from '../activity.types';

/** Same key prefix as the generated query hooks, so one invalidation refreshes both. */
const HTTP_METHOD_GET = 'get';

interface ActivityFilter {
  workspaceId: string;
  action: ActivityAction | undefined;
  outcome: ActivityOutcome | undefined;
}

async function fetchActivityPage(
  { workspaceId, action, outcome }: ActivityFilter,
  cursor: string | undefined,
  signal: AbortSignal,
) {
  const { data, error } = await fetchClient.GET(ACTIVITY_ENDPOINT, {
    params: {
      path: { workspaceId },
      query: { action, outcome, cursor, limit: ACTIVITY_PAGE_SIZE },
    },
    signal,
  });
  if (error) throw ApiRequestError.from(error);
  return data;
}

/** The workspace log, newest first, a page at a time. Always refetched when the page opens. */
export function useActivity(filter: ActivityFilter) {
  const query = useInfiniteQuery({
    queryKey: [HTTP_METHOD_GET, ACTIVITY_ENDPOINT, filter],
    queryFn: ({ pageParam, signal }) => fetchActivityPage(filter, pageParam, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
  const events: ActivityEvent[] = query.data?.pages.flatMap((page) => page.items) ?? [];
  return { ...query, events };
}
