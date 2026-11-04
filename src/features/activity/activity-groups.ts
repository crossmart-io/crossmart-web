import { formatDayHeading, toLocalDayKey } from '@/lib/relative-time';
import type { ActivityEvent } from './activity.types';

export interface ActivityDay {
  key: string;
  heading: string;
  events: ActivityEvent[];
}

/** Consecutive events of the same local day, newest day first, in the order the API sent. */
export function groupByDay(events: readonly ActivityEvent[], now = new Date()): ActivityDay[] {
  const days: ActivityDay[] = [];
  for (const event of events) {
    const key = toLocalDayKey(event.createdAt);
    const current = days.at(-1);
    if (current?.key === key) {
      current.events.push(event);
    } else {
      days.push({ key, heading: formatDayHeading(event.createdAt, now), events: [event] });
    }
  }
  return days;
}
