import { useEffect, useRef, useState } from 'react';
import { AGENT_CONSOLE_COPY, EVENT_FEED } from '../agent-console.constants';
import type { WorkspaceEvent } from '../agent-console.types';

/**
 * A sentence for screen readers about the events that just arrived, at most every few seconds:
 * "3 new events. Latest: Published “Mug” on Outlet". The first batch (the history) is not read.
 */
export function useEventAnnouncement(events: readonly WorkspaceEvent[]): string {
  const [message, setMessage] = useState('');
  const announcedId = useRef<string | null | undefined>(undefined);
  const timer = useRef<number | null>(null);
  const latest = useRef(events);

  useEffect(() => {
    latest.current = events;
  }, [events]);

  useEffect(() => {
    const newest = events.at(-1)?.id ?? null;
    if (announcedId.current === undefined) {
      if (newest !== null) announcedId.current = newest;
      return;
    }
    if (newest === announcedId.current || timer.current !== null) return;
    timer.current = window.setTimeout(() => {
      timer.current = null;
      const current = latest.current;
      const start = current.findIndex(({ id }) => id === announcedId.current) + 1;
      const fresh = current.slice(start);
      announcedId.current = current.at(-1)?.id ?? null;
      const last = fresh.at(-1);
      if (last) setMessage(AGENT_CONSOLE_COPY.announce(fresh.length, last.summary));
    }, EVENT_FEED.announceEveryMs);
  }, [events]);

  useEffect(() => () => window.clearTimeout(timer.current ?? undefined), []);
  return message;
}
