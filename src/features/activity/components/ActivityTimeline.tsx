import { useMemo } from 'react';
import type { ActivityEvent } from '../activity.types';
import { groupByDay } from '../activity-groups';
import { ActivityEventItem } from './ActivityEventItem';

/** The log grouped by day, newest first. */
export function ActivityTimeline({ events }: { events: readonly ActivityEvent[] }) {
  const days = useMemo(() => groupByDay(events), [events]);

  return (
    <div className="flex flex-col gap-6">
      {days.map((day) => (
        <section
          key={day.key}
          aria-labelledby={`activity-day-${day.key}`}
          className="flex flex-col gap-2"
        >
          <h2
            id={`activity-day-${day.key}`}
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            {day.heading}
          </h2>
          <ul className="divide-y rounded-lg border bg-card">
            {day.events.map((event) => (
              <ActivityEventItem key={event.id} event={event} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
