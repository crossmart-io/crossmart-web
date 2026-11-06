import { PAYLOAD_JSON_INDENT } from './webhooks.constants';

const NOTHING = '—';

/** "240 ms", or a dash before the first attempt. */
export function formatDuration(durationMs: number | null): string {
  return durationMs === null ? NOTHING : `${durationMs.toLocaleString()} ms`;
}

/** The receiver's HTTP status, or a dash when it never answered. */
export function formatResponseStatus(responseStatus: number | null): string {
  return responseStatus === null ? NOTHING : String(responseStatus);
}

/** The JSON body as it is sent, indented for reading. */
export function formatPayload(payload: unknown): string {
  return JSON.stringify(payload, null, PAYLOAD_JSON_INDENT);
}
