import { ApiRequestError } from '@/api/api-error';
import { readServerSentEvents } from '@/lib/sse';
import type { AgentWorkerStreamEvent } from './agent-worker.types';

const JSON_CONTENT_TYPE = 'application/json';
const EVENT_STREAM_CONTENT_TYPE = 'text/event-stream';
const HTTP_POST = 'POST';
const ABORT_ERROR_NAME = 'AbortError';

interface StreamRequest {
  url: string;
  body: unknown;
  signal: AbortSignal;
  onEvent: (event: AgentWorkerStreamEvent) => void;
}

/** A refusal before the stream opened carries a JSON body, like any other API error. */
async function toRequestError(response: Response): Promise<ApiRequestError> {
  const body: unknown = await response.json().catch(() => undefined);
  return ApiRequestError.from(body, response.status);
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === ABORT_ERROR_NAME;
}

/**
 * POSTs to a Crossmart Agent endpoint (`agent-worker` in the API) that answers with a turn's event stream, with the session
 * cookie like the rest of the API client, and reports each event as it arrives. Resolves when
 * the stream ends, also when `signal` stopped it; throws an `ApiRequestError` when the API
 * refused the request before streaming.
 */
export async function streamAgentWorkerTurn({
  url,
  body,
  signal,
  onEvent,
}: StreamRequest): Promise<void> {
  try {
    const response = await fetch(url, {
      method: HTTP_POST,
      credentials: 'include',
      headers: { 'Content-Type': JSON_CONTENT_TYPE, Accept: EVENT_STREAM_CONTENT_TYPE },
      body: JSON.stringify(body),
      signal,
    });
    if (!response.ok || !response.body) throw await toRequestError(response);
    await readServerSentEvents(response.body, (event) => {
      onEvent(JSON.parse(event.data) as AgentWorkerStreamEvent);
    });
  } catch (error) {
    if (!isAbortError(error)) throw error;
  }
}
