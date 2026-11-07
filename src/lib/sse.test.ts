import { readServerSentEvents, ServerSentEventParser, type ServerSentEvent } from './sse';

function streamOf(chunks: readonly string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
      controller.close();
    },
  });
}

describe('ServerSentEventParser', () => {
  it('reads named events with JSON data', () => {
    const parser = new ServerSentEventParser();
    expect(parser.push('event: text_delta\ndata: {"delta":"Hi"}\n\n')).toEqual([
      { event: 'text_delta', data: '{"delta":"Hi"}' },
    ]);
  });

  it('waits for the rest of an event split across chunks', () => {
    const parser = new ServerSentEventParser();
    expect(parser.push('event: mess')).toEqual([]);
    expect(parser.push('age\ndata: {"a"')).toEqual([]);
    expect(parser.push(':1}\n')).toEqual([]);
    expect(parser.push('\n')).toEqual([{ event: 'message', data: '{"a":1}' }]);
  });

  it('ignores heartbeat comments between events', () => {
    const parser = new ServerSentEventParser();
    const events = parser.push(
      ': ping\n\nevent: one\ndata: 1\n\n: ping\n\nevent: two\ndata: 2\n\n',
    );
    expect(events).toEqual([
      { event: 'one', data: '1' },
      { event: 'two', data: '2' },
    ]);
  });

  it('joins several data lines and accepts CRLF line ends', () => {
    const parser = new ServerSentEventParser();
    expect(parser.push('data: first\r\ndata:second\r\n\r\n')).toEqual([
      { event: 'message', data: 'first\nsecond' },
    ]);
  });

  it('drops an event without data and names unnamed events "message"', () => {
    const parser = new ServerSentEventParser();
    expect(parser.push('event: empty\n\ndata: x\n\n')).toEqual([{ event: 'message', data: 'x' }]);
  });

  it('flushes the last event when the stream ends without a blank line', () => {
    const parser = new ServerSentEventParser();
    expect(parser.push('event: done\ndata: {}')).toEqual([]);
    expect(parser.flush()).toEqual([{ event: 'done', data: '{}' }]);
  });
});

describe('readServerSentEvents', () => {
  it('reads every event of a body in order', async () => {
    const events: ServerSentEvent[] = [];
    await readServerSentEvents(
      streamOf(['event: a\nda', 'ta: 1\n\n: hb\n\nevent: b\n', 'data: 2\n\n']),
      (event) => events.push(event),
    );
    expect(events).toEqual([
      { event: 'a', data: '1' },
      { event: 'b', data: '2' },
    ]);
  });
});
