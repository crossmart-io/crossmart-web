import { Radio } from 'lucide-react';
import { type ReactNode, useId, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  AGENT_CONSOLE_COPY,
  AGENT_CONSOLE_TEST_IDS,
  EventFeedStatus,
  EventFilter,
} from '../agent-console.constants';
import type { WorkspaceEvent } from '../agent-console.types';
import { matchesFilter } from '../event-filters';
import { useEventAnnouncement } from '../hooks/useEventAnnouncement';
import { EventFilterBar } from './EventFilterBar';
import { EventItem } from './EventItem';

export interface EventStreamPanelProps {
  events: readonly WorkspaceEvent[];
  status: EventFeedStatus;
  onHighlight: (nodeId: string | null) => void;
  onOpenProposals: () => void;
  /** A button beside the feed status, such as one that hides the column. */
  headerAction?: ReactNode;
}

const FEED_BADGE_VARIANT: Record<EventFeedStatus, 'success' | 'secondary' | 'warning'> = {
  [EventFeedStatus.Live]: 'success',
  [EventFeedStatus.Connecting]: 'secondary',
  [EventFeedStatus.Reconnecting]: 'warning',
  [EventFeedStatus.Polling]: 'secondary',
};

function FeedStatus({ status }: { status: EventFeedStatus }) {
  return (
    <Badge variant={FEED_BADGE_VARIANT[status]}>
      <Radio aria-hidden="true" />
      {AGENT_CONSOLE_COPY.feed[status]}
    </Badge>
  );
}

function EmptyEvents({ filtered }: { filtered: boolean }) {
  return (
    <p className="px-3 py-6 text-center text-sm text-muted-foreground">
      {filtered ? AGENT_CONSOLE_COPY.noMatches : AGENT_CONSOLE_COPY.noEvents}
    </p>
  );
}

/**
 * What happens in the workspace, newest first, filtered by kind. New events are announced to
 * screen readers together every few seconds, in a polite status region, not one by one.
 */
export function EventStreamPanel({
  events,
  status,
  headerAction,
  ...itemProps
}: EventStreamPanelProps) {
  const [filter, setFilter] = useState(EventFilter.All);
  const titleId = useId();
  const shown = useMemo(
    () => events.filter((event) => matchesFilter(event, filter)).toReversed(),
    [events, filter],
  );
  const announcement = useEventAnnouncement(events);
  return (
    <section
      aria-labelledby={titleId}
      data-testid={AGENT_CONSOLE_TEST_IDS.events}
      className="flex h-full min-h-0 flex-col"
    >
      <header className="flex flex-col gap-2 border-b px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <h2 id={titleId} className="text-sm font-semibold">
            {AGENT_CONSOLE_COPY.eventsTitle}
          </h2>
          <div className="flex items-center gap-1">
            <FeedStatus status={status} />
            {headerAction}
          </div>
        </div>
        <EventFilterBar value={filter} onChange={setFilter} />
      </header>
      <ol aria-label={AGENT_CONSOLE_COPY.eventsLabel} className="min-h-0 flex-1 overflow-y-auto">
        {shown.map((event) => (
          <EventItem key={event.id} event={event} {...itemProps} />
        ))}
      </ol>
      {shown.length === 0 && <EmptyEvents filtered={filter !== EventFilter.All} />}
      <output aria-live="polite" className="sr-only">
        {announcement}
      </output>
    </section>
  );
}
