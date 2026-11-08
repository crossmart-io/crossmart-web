/** One server-sent event: its name (`message` when the server named none), data and id. */
export interface ServerSentEvent {
  event: string;
  data: string;
  /** The last id the stream set, which a client sends back as `Last-Event-ID`; empty for none. */
  id: string;
}

/** The name the spec gives an event that has no `event:` field. */
export const DEFAULT_SSE_EVENT = 'message';

const FIELD_SEPARATOR = ':';
const COMMENT_PREFIX = ':';
const LINE_FEED = '\n';
const CARRIAGE_RETURN = '\r';
const EVENT_FIELD = 'event';
const DATA_FIELD = 'data';
const ID_FIELD = 'id';
const DATA_LINE_JOINER = '\n';

/**
 * Turns the text of an event stream into events, chunk by chunk, as the `text/event-stream`
 * format defines it (LF or CRLF line ends): `field: value` lines, an empty line ends an event, and lines starting with
 * a colon are comments (heartbeats). A chunk may end anywhere, even inside a line.
 */
export class ServerSentEventParser {
  private buffer = '';
  private eventName = '';
  private dataLines: string[] = [];
  /** Kept across events, as the format says: an event without an id has the last one. */
  private lastEventId = '';

  /** The events `chunk` completes; an unfinished line or event waits for the next chunk. */
  push(chunk: string): ServerSentEvent[] {
    this.buffer += chunk;
    const lines = this.buffer.split(LINE_FEED);
    this.buffer = lines.pop() ?? '';
    return lines.flatMap((line) => this.readLine(stripCarriageReturn(line)));
  }

  /** The last event, when the stream ended without the empty line after it. */
  flush(): ServerSentEvent[] {
    const rest = this.buffer;
    this.buffer = '';
    const events = rest ? this.readLine(stripCarriageReturn(rest)) : [];
    return [...events, ...this.dispatch()];
  }

  private readLine(line: string): ServerSentEvent[] {
    if (line === '') return this.dispatch();
    if (line.startsWith(COMMENT_PREFIX)) return [];
    const separator = line.indexOf(FIELD_SEPARATOR);
    const field = separator === -1 ? line : line.slice(0, separator);
    const value = separator === -1 ? '' : stripLeadingSpace(line.slice(separator + 1));
    if (field === EVENT_FIELD) this.eventName = value;
    else if (field === DATA_FIELD) this.dataLines.push(value);
    else if (field === ID_FIELD) this.lastEventId = value;
    return [];
  }

  /** Ends the current event; one with no data is dropped, as the format says. */
  private dispatch(): ServerSentEvent[] {
    const event = this.eventName || DEFAULT_SSE_EVENT;
    const lines = this.dataLines;
    this.eventName = '';
    this.dataLines = [];
    const data = lines.join(DATA_LINE_JOINER);
    return lines.length ? [{ event, data, id: this.lastEventId }] : [];
  }
}

/** Lines may end in CRLF; the LF splits them, so a trailing CR is dropped here. */
function stripCarriageReturn(line: string): string {
  return line.endsWith(CARRIAGE_RETURN) ? line.slice(0, -1) : line;
}

function stripLeadingSpace(value: string): string {
  return value.startsWith(' ') ? value.slice(1) : value;
}

/** Reads an event stream's body to its end, calling `onEvent` for each event in order. */
export async function readServerSentEvents(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: ServerSentEvent) => void,
): Promise<void> {
  const parser = new ServerSentEventParser();
  const decoder = new TextDecoder();
  const reader = body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      parser.push(decoder.decode(value, { stream: true })).forEach(onEvent);
    }
    parser.push(decoder.decode()).forEach(onEvent);
    parser.flush().forEach(onEvent);
  } finally {
    reader.releaseLock();
  }
}
