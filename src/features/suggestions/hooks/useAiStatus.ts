import { api } from '@/api/client';
import { AI_STATUS_ENDPOINT, AI_STATUS_STALE_MS } from '../suggestions.constants';

/** Whether this server has AI configured; waits until there is a workspace. */
export function useAiStatus(workspaceId: string | undefined) {
  return api.useQuery(
    'get',
    AI_STATUS_ENDPOINT,
    { params: { path: { workspaceId: workspaceId ?? '' } } },
    { enabled: Boolean(workspaceId), staleTime: AI_STATUS_STALE_MS },
  );
}
