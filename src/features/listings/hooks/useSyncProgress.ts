import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { endpointQueryKey } from '@/api/query-keys';
import { fetchClient } from '@/api/client';
import { unwrap } from '@/api/unwrap';
import { LIVE_POLLING } from '@/lib/in-flight-polling';
import { SYNC_COPY, SYNC_ENDPOINT } from '../listings.constants';
import type { SyncProgress } from '../listings.types';

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

/** "2 failed, 3 still to send": what is left of a sync, or that every product went. */
export function describeSyncProgress(progress: SyncProgress): string {
  const parts: string[] = [];
  if (progress.pending > 0) parts.push(SYNC_COPY.waiting(progress.pending));
  if (progress.failed > 0) parts.push(SYNC_COPY.failed(progress.failed));
  return parts.length > 0 ? parts.join(', ') : SYNC_COPY.allSent;
}

/** Whether to stop watching: the server says nothing it queued is pending, or it took too long. */
export function isSettled(progress: SyncProgress, elapsedMs: number): boolean {
  return progress.done || elapsedMs >= LIVE_POLLING.maxDurationMs;
}

/** Whether progress fetched after the sync started says it has settled. */
function settledSince(
  startedAt: number,
  progress: SyncProgress | undefined,
  dataUpdatedAt: number,
): boolean {
  if (!progress || dataUpdatedAt < startedAt) return false;
  return isSettled(progress, dataUpdatedAt - startedAt);
}

function announce(progress: SyncProgress, channelName: string): void {
  const description = describeSyncProgress(progress);
  if (!progress.done) {
    toast.info(SYNC_COPY.stillWorking(channelName), { description });
  } else if (progress.failed > 0) {
    toast.warning(SYNC_COPY.finished(channelName), { description });
  } else {
    toast.success(SYNC_COPY.finished(channelName), { description });
  }
}

/** Toasts the outcome once per sync, however often the component renders after it. */
function useAnnounceOnce(
  startedAt: number | null,
  progress: SyncProgress | undefined,
  channelName: string,
) {
  const announcedFor = useRef<number | null>(null);
  useEffect(() => {
    if (startedAt === null || !progress || announcedFor.current === startedAt) return;
    announcedFor.current = startedAt;
    announce(progress, channelName);
  }, [startedAt, progress, channelName]);
}

/**
 * After "Send all products again": the store's sync progress, checked every few seconds until
 * the server says nothing it queued is pending, then a toast that sums it up. "Finished" means
 * every queued job finished, not that the store merely looks quiet.
 */
export function useSyncProgress(ref: ConnectionRef, channelName: string) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const query = useQuery({
    queryKey: [...endpointQueryKey(SYNC_ENDPOINT), ref],
    queryFn: ({ signal }) =>
      unwrap(fetchClient.GET(SYNC_ENDPOINT, { params: { path: ref }, signal })),
    enabled: startedAt !== null,
    staleTime: 0,
    refetchInterval: (polled) =>
      startedAt !== null && settledSince(startedAt, polled.state.data, polled.state.dataUpdatedAt)
        ? false
        : LIVE_POLLING.intervalMs,
  });
  const fresh = startedAt !== null && query.dataUpdatedAt >= startedAt ? query.data : undefined;
  const settled = startedAt !== null && settledSince(startedAt, fresh, query.dataUpdatedAt);
  const watching = startedAt !== null && !settled;
  useAnnounceOnce(settled ? startedAt : null, fresh, channelName);
  const start = useCallback(() => setStartedAt(Date.now()), []);
  return { watching, progress: fresh, start };
}
