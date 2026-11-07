import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import {
  AgentWorkerActionStatus,
  AgentWorkerEventType,
  AgentWorkerRole,
  AgentWorkerTurnStatus,
} from '@/api/schema';
import { env } from '@/config/env';
import {
  actionFixture,
  eventStreamText,
  messageFixture,
  turnFixture,
} from '../testing/agent-worker.fixture';
import { TurnRequestKind, useAgentWorkerTurn } from './useAgentWorkerTurn';

const MESSAGES_URL = `${env.apiUrl}/api/v1/workspaces/ws-1/agent-worker/conversations/cv-1/messages`;

/** A body that sends `text` in two chunks, split mid-event, as a network would. */
function streamingResponse(text: string): Response {
  const encoder = new TextEncoder();
  const middle = Math.floor(text.length / 2);
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(text.slice(0, middle)));
      controller.enqueue(encoder.encode(text.slice(middle)));
      controller.close();
    },
  });
  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
}

function renderTurnHook() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const hook = renderHook(() => useAgentWorkerTurn('ws-1'), { wrapper });
  return { ...hook, invalidate };
}

const fetchMock = vi.fn<typeof fetch>();

describe('useAgentWorkerTurn', () => {
  beforeEach(() => vi.stubGlobal('fetch', fetchMock));
  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it('streams a turn into the live state, then refetches the conversation', async () => {
    const proposed = actionFixture({ status: AgentWorkerActionStatus.proposed });
    fetchMock.mockResolvedValue(
      streamingResponse(
        eventStreamText([
          { type: AgentWorkerEventType.turn_started, turn: turnFixture() },
          { type: AgentWorkerEventType.message, message: messageFixture() },
          { type: AgentWorkerEventType.text_delta, delta: 'I can retitle it.' },
          { type: AgentWorkerEventType.action_proposed, action: proposed },
          {
            type: AgentWorkerEventType.turn_finished,
            turn: turnFixture({ status: AgentWorkerTurnStatus.awaiting_approval }),
          },
        ]),
      ),
    );
    const { result, invalidate } = renderTurnHook();

    act(() =>
      result.current.start({
        kind: TurnRequestKind.Message,
        conversationId: 'cv-1',
        body: { text: 'Retitle the Linen Shirt' },
      }),
    );
    await waitFor(() => expect(result.current.isStreaming).toBe(false));

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe(MESSAGES_URL);
    expect(init).toMatchObject({ method: 'POST', credentials: 'include' });
    expect(JSON.parse(init?.body as string)).toEqual({ text: 'Retitle the Linen Shirt' });
    expect(invalidate).toHaveBeenCalled();
    // Settled: the stored conversation now holds the messages; the ending stays.
    expect(result.current.live.turn?.status).toBe(AgentWorkerTurnStatus.awaiting_approval);
    expect(result.current.live.messages).toEqual([]);
  });

  it('shows streamed messages while the turn runs', async () => {
    let finish: (() => void) | undefined;
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        const answer = messageFixture({ id: 'm-2', role: AgentWorkerRole.assistant, text: 'Hi' });
        controller.enqueue(
          encoder.encode(
            eventStreamText([{ type: AgentWorkerEventType.message, message: answer }]),
          ),
        );
        finish = () => controller.close();
      },
    });
    fetchMock.mockResolvedValue(new Response(body, { status: 200 }));
    const { result } = renderTurnHook();

    act(() =>
      result.current.start({
        kind: TurnRequestKind.Message,
        conversationId: 'cv-1',
        body: { text: 'Hello' },
      }),
    );
    await waitFor(() => expect(result.current.live.messages).toHaveLength(1));
    expect(result.current.isStreaming).toBe(true);
    act(() => finish?.());
    await waitFor(() => expect(result.current.isStreaming).toBe(false));
  });

  it('fails the request when the API refuses it before streaming', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ statusCode: 409, message: 'A turn is already running' }), {
        status: 409,
      }),
    );
    const onError = vi.fn<() => void>();
    const { result } = renderTurnHook();

    act(() =>
      result.current.start(
        {
          kind: TurnRequestKind.Decision,
          conversationId: 'cv-1',
          body: { approvedActionIds: [], confirmHighRisk: false },
        },
        { onError },
      ),
    );
    await waitFor(() => expect(onError).toHaveBeenCalled());
    expect(fetchMock.mock.calls[0]?.[0]).toMatch(/\/decision$/);
  });
});
