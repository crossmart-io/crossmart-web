import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { endpointQueryKey } from '@/api/query-keys';
import { fetchClient } from '@/api/client';
import { unwrap } from '@/api/unwrap';
import { LIVE_POLLING } from '@/lib/in-flight-polling';
import { pluralize } from '@/lib/format';
import { CHANNEL_PRODUCTS_ENDPOINT, SYNC_COPY, SYNC_MIN_WATCH_MS } from '../listings.constants';
import type { ChannelProductCounts } from '../listings.types';

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

/** Only the counts are read, so one row is enough. */
const COUNTS_QUERY = { page: 1, limit: 1 } as const;

/** Products the store is still publishing or taking off. */
export function inFlightCount(counts: ChannelProductCounts): number {
  return counts.pending + counts.removing;
}

/** "38 published, 2 failed, 1 still to send": where the store stands once the sync settles. */
export function describeSyncOutcome(counts: ChannelProductCounts): string {
  const parts = [`${pluralize(counts.listed, 'product')} published`];
  if (counts.failed > 0) parts.push(`${counts.failed} failed`);
  const waiting = inFlightCount(counts);
  if (waiting > 0) parts.push(SYNC_COPY.waiting(waiting));
  return parts.join(', ');
}

/** Whether to stop watching: nothing left in flight once the jobs had time to start, or too long. */
function isSettled(counts: ChannelProductCounts, elapsedMs: number): boolean {
  if (elapsedMs >= LIVE_POLLING.maxDurationMs) return true;
  return elapsedMs >= SYNC_MIN_WATCH_MS && inFlightCount(counts) === 0;
}

/** Whether counts fetched after the sync started say it has settled. */
function settledSince(
  startedAt: number,
  counts: ChannelProductCounts | undefined,
  dataUpdatedAt: number,
): boolean {
  if (!counts || dataUpdatedAt < startedAt) return false;
  return isSettled(counts, dataUpdatedAt - startedAt);
}

/** Toasts the outcome once per sync, however often the component renders after it. */
function useAnnounceOnce(
  startedAt: number | null,
  counts: ChannelProductCounts | undefined,
  channelName: string,
) {
  const announcedFor = useRef<number | null>(null);
  useEffect(() => {
    if (startedAt === null || !counts || announcedFor.current === startedAt) return;
    announcedFor.current = startedAt;
    announce(counts, channelName);
  }, [startedAt, counts, channelName]);
}

function announce(counts: ChannelProductCounts, channelName: string): void {
  const description = describeSyncOutcome(counts);
  if (inFlightCount(counts) > 0) {
    toast.info(SYNC_COPY.stillWorking(channelName), { description });
  } else if (counts.failed > 0) {
    toast.warning(SYNC_COPY.finished(channelName), { description });
  } else {
    toast.success(SYNC_COPY.finished(channelName), { description });
  }
}

/**
 * After "Send all products again": the store's counts, checked every few seconds until nothing
 * is left to send, then a toast that sums up where the store stands.
 */
export function useSyncProgress(ref: ConnectionRef, channelName: string) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const query = useQuery({
    queryKey: [...endpointQueryKey(CHANNEL_PRODUCTS_ENDPOINT), ref, COUNTS_QUERY],
    queryFn: ({ signal }) =>
      unwrap(
        fetchClient.GET(CHANNEL_PRODUCTS_ENDPOINT, {
          params: { path: ref, query: COUNTS_QUERY },
          signal,
        }),
      ),
    select: (page) => page.counts,
    enabled: startedAt !== null,
    staleTime: 0,
    refetchInterval: (polled) =>
      startedAt !== null &&
      settledSince(startedAt, polled.state.data?.counts, polled.state.dataUpdatedAt)
        ? false
        : LIVE_POLLING.intervalMs,
  });
  const fresh = startedAt !== null && query.dataUpdatedAt >= startedAt ? query.data : undefined;
  const settled = startedAt !== null && settledSince(startedAt, fresh, query.dataUpdatedAt);
  const watching = startedAt !== null && !settled;
  useAnnounceOnce(settled ? startedAt : null, fresh, channelName);
  const start = useCallback(() => setStartedAt(Date.now()), []);
  return { watching, counts: fresh, start };
}
