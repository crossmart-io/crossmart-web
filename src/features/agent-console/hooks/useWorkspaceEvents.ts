import { useEffect, useState } from 'react';
import { toApiUrl } from '@/api/api-url';
import { fetchClient } from '@/api/client';
import { unwrap } from '@/api/unwrap';
import {
  EVENT_FEED,
  EVENT_STREAM_ACCEPT,
  EventFeedStatus,
  LAST_EVENT_ID_HEADER,
  WORKSPACE_EVENTS_ENDPOINT,
  WORKSPACE_EVENTS_STREAM_ENDPOINT,
} from '../agent-console.constants';
import type { WorkspaceEvent } from '../agent-console.types';
import { mergeEvents } from '../event-buffer';
import { type EventFeedTransport, WorkspaceEventConnection } from '../workspace-event-connection';

/** Waits on the window's timer; an abort ends the wait early. */
function wait(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, milliseconds);
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

/** The stream with the session cookie, like the rest of the API client, and the list to poll. */
function browserTransport(workspaceId: string): EventFeedTransport {
  return {
    openStream: (lastEventId, signal) =>
      fetch(toApiUrl(WORKSPACE_EVENTS_STREAM_ENDPOINT, { workspaceId }), {
        credentials: 'include',
        headers: {
          Accept: EVENT_STREAM_ACCEPT,
          ...(lastEventId ? { [LAST_EVENT_ID_HEADER]: lastEventId } : {}),
        },
        signal,
      }),
    fetchPage: (cursor) =>
      unwrap(
        fetchClient.GET(WORKSPACE_EVENTS_ENDPOINT, {
          params: { path: { workspaceId }, query: cursor ? { after: cursor } : {} },
        }),
      ),
    wait,
  };
}

export interface WorkspaceEventFeed {
  /** Oldest first, the newest few hundred. */
  events: readonly WorkspaceEvent[];
  status: EventFeedStatus;
}

/**
 * What happens in the workspace, live: the latest events, then each new one as it happens, over
 * the event stream (or the list, polled, when the stream keeps failing). Key the caller by
 * workspace, so another workspace starts from nothing.
 */
export function useWorkspaceEvents(workspaceId: string): WorkspaceEventFeed {
  const [events, setEvents] = useState<readonly WorkspaceEvent[]>([]);
  const [status, setStatus] = useState(EventFeedStatus.Connecting);

  useEffect(() => {
    const controller = new AbortController();
    const connection = new WorkspaceEventConnection(browserTransport(workspaceId), {
      onEvents: (incoming) =>
        setEvents((kept) => mergeEvents(kept, incoming, EVENT_FEED.bufferSize)),
      onStatus: setStatus,
    });
    void connection.run(controller.signal);
    return () => controller.abort();
  }, [workspaceId]);

  return { events, status };
}
