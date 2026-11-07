import type { DayRange } from './ask-insights.types';

/** The API's period: instants, both included, as ISO 8601 date-times. */
export interface InstantRange {
  from?: string;
  to?: string;
}

const DAY_START_TIME = 'T00:00:00';
const DAY_END_TIME = 'T23:59:59.999';

/** A local calendar day at `time`, as an instant; undefined for an empty or invalid day. */
function toInstant(day: string | undefined, time: string): string | undefined {
  if (!day) return undefined;
  const instant = new Date(`${day}${time}`);
  return Number.isNaN(instant.getTime()) ? undefined : instant.toISOString();
}

/** The days the admin picked, in their time zone, from the first's start to the last's end. */
export function toInstantRange({ from, to }: DayRange): InstantRange {
  return { from: toInstant(from, DAY_START_TIME), to: toInstant(to, DAY_END_TIME) };
}
