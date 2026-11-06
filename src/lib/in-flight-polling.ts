/** How often lists refetch while something in them is still moving, and for how long at most. */
export const LIVE_POLLING = {
  intervalMs: 3_000,
  /** A job stuck in a queue must not keep the page polling forever. */
  maxDurationMs: 120_000,
} as const;

interface PollingOptions {
  intervalMs: number;
  maxDurationMs: number;
}

/** The part of a TanStack query a refetch interval reads. */
interface PolledQuery<TData> {
  state: { data: TData | undefined; dataUpdatedAt: number };
}

/** One stretch of polling: since when, and when it gave up, if it did. */
interface PollingWindow {
  startedAt: number;
  cappedAt?: number;
}

/**
 * A `refetchInterval` that polls only while the data has something in flight (publishing,
 * removing), and stops when nothing is, or after `maxDurationMs`. Data fetched after it gave up
 * came from an action or a revisit, so it starts a new window.
 */
export class InFlightPolling<TData> {
  private readonly windows = new WeakMap<object, PollingWindow>();

  constructor(
    private readonly isInFlight: (data: TData) => boolean,
    private readonly now: () => number = Date.now,
    private readonly options: PollingOptions = LIVE_POLLING,
  ) {}

  readonly interval = (query: PolledQuery<TData>): number | false => {
    const { data, dataUpdatedAt } = query.state;
    if (data === undefined || !this.isInFlight(data)) {
      this.windows.delete(query);
      return false;
    }
    const window = this.windowFor(query, dataUpdatedAt);
    if (this.now() - window.startedAt < this.options.maxDurationMs) return this.options.intervalMs;
    window.cappedAt ??= this.now();
    return false;
  };

  private windowFor(query: object, dataUpdatedAt: number): PollingWindow {
    const current = this.windows.get(query);
    if (current && (current.cappedAt === undefined || dataUpdatedAt <= current.cappedAt)) {
      return current;
    }
    const fresh: PollingWindow = { startedAt: this.now() };
    this.windows.set(query, fresh);
    return fresh;
  }
}
