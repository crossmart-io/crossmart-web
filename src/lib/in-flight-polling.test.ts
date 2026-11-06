import { InFlightPolling, LIVE_POLLING } from './in-flight-polling';

interface Page {
  inFlight: boolean;
}

function setup() {
  let now = 1_000;
  const polling = new InFlightPolling<Page>(
    (page) => page.inFlight,
    () => now,
  );
  const query = { state: { data: undefined as Page | undefined, dataUpdatedAt: 0 } };
  const receive = (page: Page) => {
    query.state = { data: page, dataUpdatedAt: now };
    return polling.interval(query);
  };
  const advance = (ms: number) => {
    now += ms;
  };
  return { polling, query, receive, advance };
}

describe('InFlightPolling', () => {
  it('does not poll before data arrives, or when nothing is in flight', () => {
    const { polling, query, receive } = setup();

    expect(polling.interval(query)).toBe(false);
    expect(receive({ inFlight: false })).toBe(false);
  });

  it('polls while something is in flight and stops once it lands', () => {
    const { receive, advance } = setup();

    expect(receive({ inFlight: true })).toBe(LIVE_POLLING.intervalMs);
    advance(LIVE_POLLING.intervalMs);
    expect(receive({ inFlight: true })).toBe(LIVE_POLLING.intervalMs);
    advance(LIVE_POLLING.intervalMs);
    expect(receive({ inFlight: false })).toBe(false);
  });

  it('gives up after the cap, and stays stopped on re-renders', () => {
    const { polling, query, receive, advance } = setup();

    receive({ inFlight: true });
    advance(LIVE_POLLING.maxDurationMs);
    expect(receive({ inFlight: true })).toBe(false);
    advance(LIVE_POLLING.intervalMs);
    expect(polling.interval(query)).toBe(false);
  });

  it('starts again when an action refetches after it gave up', () => {
    const { receive, advance } = setup();

    receive({ inFlight: true });
    advance(LIVE_POLLING.maxDurationMs);
    receive({ inFlight: true });
    advance(LIVE_POLLING.intervalMs);

    expect(receive({ inFlight: true })).toBe(LIVE_POLLING.intervalMs);
  });

  it('starts a new window after a stretch with nothing in flight', () => {
    const { receive, advance } = setup();

    receive({ inFlight: true });
    advance(LIVE_POLLING.maxDurationMs - 1);
    receive({ inFlight: false });
    advance(LIVE_POLLING.intervalMs);

    expect(receive({ inFlight: true })).toBe(LIVE_POLLING.intervalMs);
  });
});
