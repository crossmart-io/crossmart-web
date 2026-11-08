import { useEffect, useRef } from 'react';
import { WorkspaceEventCategory, WorkspaceEventType } from '@/api/schema';
import { CATALOG_STATS_ENDPOINT } from '@/features/catalog/catalog.constants';
import { CHANNEL_CONNECTIONS_ENDPOINT } from '@/features/channels/channels.constants';
import { LISTING_HEALTH_ENDPOINT } from '@/features/listing-health/listing-health.constants';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { EVENT_FEED } from '../agent-console.constants';
import type { WorkspaceEvent } from '../agent-console.types';

/** What the map and the status bar read, refetched when the stream says it changed. */
export const REFRESHED_ENDPOINTS = [
  LISTING_HEALTH_ENDPOINT,
  CATALOG_STATS_ENDPOINT,
  CHANNEL_CONNECTIONS_ENDPOINT,
] as const;

/** Store and order events change the counts; so does a change the agent just applied. */
function changesTheMap(event: WorkspaceEvent): boolean {
  return (
    event.category !== WorkspaceEventCategory.agent ||
    event.type === WorkspaceEventType.agent_change_applied ||
    event.type === WorkspaceEventType.agent_activity
  );
}

/**
 * Keeps the map's figures current: when new events arrive that change listings, stock or stores,
 * the counts are refetched, at most once every couple of seconds.
 */
export function useEventRefresh(events: readonly WorkspaceEvent[]): void {
  const refresh = useInvalidateEndpoints(REFRESHED_ENDPOINTS);
  const seen = useRef<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const newest = events.at(-1)?.id ?? null;
    const previous = seen.current;
    seen.current = newest;
    if (previous === null || newest === previous) return;
    const start = events.findIndex(({ id }) => id === previous) + 1;
    if (!events.slice(start).some(changesTheMap) || timer.current !== null) return;
    timer.current = window.setTimeout(() => {
      timer.current = null;
      void refresh();
    }, EVENT_FEED.refreshEveryMs);
  }, [events, refresh]);

  useEffect(() => () => window.clearTimeout(timer.current ?? undefined), []);
}
