import { useEffect, useRef } from 'react';
import { AgentWorkerActionStatus } from '@/api/schema';
import type { AgentWorkerSession } from '@/features/agent-worker';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { REFRESHED_ENDPOINTS } from './useEventRefresh';

/**
 * Refetches the map's counts as soon as the running turn reports a change applied, without
 * waiting for its event to come through the stream.
 */
export function useRefreshOnAgentChanges(session: AgentWorkerSession | null): void {
  const refresh = useInvalidateEndpoints(REFRESHED_ENDPOINTS);
  const applied = Object.values(session?.live.actions ?? {}).filter(
    (action) => action.status === AgentWorkerActionStatus.executed,
  ).length;
  const seen = useRef(0);

  useEffect(() => {
    const previous = seen.current;
    seen.current = applied;
    if (applied > previous) void refresh();
  }, [applied, refresh]);
}
