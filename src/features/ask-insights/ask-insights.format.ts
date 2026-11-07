import { MS_PER_SECOND } from './ask-insights.constants';

const SECONDS_FORMAT = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 });

/** A latency as people read it: "850 ms" under a second, "1.2 s" from there. */
export function formatDuration(milliseconds: number): string {
  return milliseconds < MS_PER_SECOND
    ? `${milliseconds} ms`
    : `${SECONDS_FORMAT.format(milliseconds / MS_PER_SECOND)} s`;
}
