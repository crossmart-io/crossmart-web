import { readServerSentEvents, type ServerSentEvent } from '@/lib/sse';
import { EVENT_FEED, EventFeedStatus, WorkspaceStreamEvent } from './agent-console.constants';
import type { WorkspaceEvent, WorkspaceEventPage } from './agent-console.types';

/** What the connection needs from the outside: the network and the clock, swapped in tests. */
export interface EventFeedTransport {
  /** Opens the stream, resuming after `lastEventId` when there is one. */
  openStream: (lastEventId: string | null, signal: AbortSignal) => Promise<Response>;
  /** One page of the list after `cursor`, or the latest events without one. */
  fetchPage: (cursor: string | null) => Promise<WorkspaceEventPage>;
  wait: (milliseconds: number, signal: AbortSignal) => Promise<void>;
}

export interface EventFeedListener {
  onEvents: (events: WorkspaceEvent[]) => void;
  onStatus: (status: EventFeedStatus) => void;
}

/** Each failed attempt doubles the wait before the next. */
const BACKOFF_FACTOR = 2;

/** The stream refused, or ended before it was ready. */
class StreamFailedError extends Error {}

/**
 * Follows the workspace event stream (ADR 0027) for as long as its signal lives: the stream
 * first, resumed with `Last-Event-ID` after a drop, with a growing wait between attempts. After
 * a few failed streams in a row it polls the list instead, then tries the stream again.
 */
export class WorkspaceEventConnection {
  private cursor: string | null = null;
  private failures = 0;

  constructor(
    private readonly transport: EventFeedTransport,
    private readonly listener: EventFeedListener,
  ) {}

  async run(signal: AbortSignal): Promise<void> {
    this.listener.onStatus(EventFeedStatus.Connecting);
    while (!signal.aborted) {
      try {
        if (this.failures >= EVENT_FEED.streamFailuresBeforePolling) await this.poll(signal);
        else await this.stream(signal);
      } catch {
        if (signal.aborted) return;
        this.failures += 1;
        this.listener.onStatus(EventFeedStatus.Reconnecting);
        await this.transport.wait(this.backoff(), signal).catch(() => undefined);
      }
    }
  }

  /** Reads the stream until it ends; it ends on its own every few minutes, and is reopened. */
  private async stream(signal: AbortSignal): Promise<void> {
    const response = await this.transport.openStream(this.cursor, signal);
    if (!response.ok || !response.body) throw new StreamFailedError();
    let ready = false;
    const pending: WorkspaceEvent[] = [];
    await readServerSentEvents(response.body, (event) => {
      if (event.event === WorkspaceStreamEvent.Ready) {
        ready = true;
        this.ready(event, pending.splice(0));
      } else if (event.event === WorkspaceStreamEvent.Event) {
        this.received(event, ready ? null : pending);
      }
    });
    if (!ready) throw new StreamFailedError();
  }

  /** The backlog goes out in one batch, then each event as it comes. */
  private received(event: ServerSentEvent, backlog: WorkspaceEvent[] | null): void {
    const parsed = JSON.parse(event.data) as WorkspaceEvent;
    this.cursor = event.id || parsed.cursor;
    if (backlog) backlog.push(parsed);
    else this.listener.onEvents([parsed]);
  }

  private ready(event: ServerSentEvent, backlog: WorkspaceEvent[]): void {
    this.cursor = event.id || this.cursor;
    this.failures = 0;
    if (backlog.length) this.listener.onEvents(backlog);
    this.listener.onStatus(EventFeedStatus.Live);
  }

  /** A round of polling, after which the stream is tried again. */
  private async poll(signal: AbortSignal): Promise<void> {
    for (let round = 0; round < EVENT_FEED.pollsBeforeStreamRetry && !signal.aborted; round += 1) {
      const page = await this.transport.fetchPage(this.cursor);
      this.cursor = page.cursor;
      if (page.items.length) this.listener.onEvents(page.items);
      this.listener.onStatus(EventFeedStatus.Polling);
      await this.transport.wait(EVENT_FEED.pollMs, signal);
    }
    this.failures = 0;
  }

  private backoff(): number {
    const doubled = EVENT_FEED.reconnectMs * BACKOFF_FACTOR ** Math.max(this.failures - 1, 0);
    return Math.min(doubled, EVENT_FEED.maxReconnectMs);
  }
}
