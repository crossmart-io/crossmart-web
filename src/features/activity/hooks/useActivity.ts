import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import type { ActivityAction, ActivityOutcome } from '@/api/schema';
import { useCursorPages } from '@/hooks/useCursorPages';
import { ACTIVITY_ENDPOINT, ACTIVITY_PAGE_SIZE } from '../activity.constants';
import type { ActivityEvent } from '../activity.types';

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
  const query = useCursorPages<ActivityEvent>({
    endpoint: ACTIVITY_ENDPOINT,
    params: filter,
    fetchPage: (cursor, signal) => fetchActivityPage(filter, cursor, signal),
    staleTime: 0,
    keepPreviousPages: true,
  });
  return { ...query, events: query.items };
}
