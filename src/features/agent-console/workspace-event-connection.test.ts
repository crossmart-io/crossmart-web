import { EVENT_FEED, EventFeedStatus } from './agent-console.constants';
import type { WorkspaceEvent } from './agent-console.types';
import { workspaceEventFixture } from './testing/workspace-event.fixture';
import { type EventFeedTransport, WorkspaceEventConnection } from './workspace-event-connection';

function streamOf(text: string): Response {
  return new Response(text, { headers: { 'content-type': 'text/event-stream' } });
}

function eventText(event: WorkspaceEvent): string {
  return `id: ${event.cursor}\nevent: workspace_event\ndata: ${JSON.stringify(event)}\n\n`;
}

const READY = (cursor: string) => `id: ${cursor}\nevent: ready\ndata: {"cursor":"${cursor}"}\n\n`;

function setup(streams: (() => Promise<Response>)[]) {
  const controller = new AbortController();
  const opened: (string | null)[] = [];
  const transport: EventFeedTransport = {
    openStream: vi.fn<EventFeedTransport['openStream']>((lastEventId) => {
      opened.push(lastEventId);
      const next = streams.shift();
      if (!next) controller.abort();
      return next ? next() : Promise.reject(new Error('done'));
    }),
    fetchPage: vi.fn<EventFeedTransport['fetchPage']>().mockResolvedValue({
      items: [workspaceEventFixture({ id: 'polled' })],
      cursor: 'p-1',
    }),
    wait: vi.fn<EventFeedTransport['wait']>().mockResolvedValue(),
  };
  const received: string[][] = [];
  const statuses: EventFeedStatus[] = [];
  const connection = new WorkspaceEventConnection(transport, {
    onEvents: (events) => received.push(events.map(({ id }) => id)),
    onStatus: (status) => statuses.push(status),
  });
  return { connection, controller, transport, opened, received, statuses };
}

describe('WorkspaceEventConnection', () => {
  it('sends the backlog in one batch, goes live, and resumes after the last event', async () => {
    const first = workspaceEventFixture({ id: 'a', cursor: 'c-a' });
    const second = workspaceEventFixture({ id: 'b', cursor: 'c-b' });
    const later = workspaceEventFixture({ id: 'c', cursor: 'c-c' });
    const { connection, controller, opened, received, statuses } = setup([
      () =>
        Promise.resolve(
          streamOf(eventText(first) + eventText(second) + READY('c-b') + eventText(later)),
        ),
    ]);

    await connection.run(controller.signal);

    expect(received).toEqual([['a', 'b'], ['c']]);
    expect(statuses).toContain(EventFeedStatus.Live);
    expect(opened).toEqual([null, 'c-c']);
  });

  it('polls the list after the stream fails again and again', async () => {
    const failing = () => Promise.resolve(new Response('', { status: 503 }));
    const streams = Array.from({ length: EVENT_FEED.streamFailuresBeforePolling }, () => failing);
    const { connection, controller, transport, received, statuses } = setup(streams);
    vi.mocked(transport.fetchPage).mockImplementationOnce(() => {
      controller.abort();
      return Promise.resolve({ items: [workspaceEventFixture({ id: 'polled' })], cursor: 'p-1' });
    });

    await connection.run(controller.signal);

    expect(statuses).toContain(EventFeedStatus.Reconnecting);
    expect(transport.fetchPage).toHaveBeenCalledWith(null);
    expect(received).toEqual([['polled']]);
  });
});
