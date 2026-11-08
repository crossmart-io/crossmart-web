import { Link } from 'react-router';
import { WorkspaceEventSeverity, WorkspaceEventType } from '@/api/schema';
import { RelativeTime } from '@/components/time/RelativeTime';
import { cn } from '@/lib/utils';
import { AGENT_CONSOLE_TEST_IDS } from '../agent-console.constants';
import type { WorkspaceEvent } from '../agent-console.types';
import { actorLabel, eventNodeId, eventRoute, SEVERITY_PRESENTATION } from '../event-presentation';

export interface EventItemProps {
  event: WorkspaceEvent;
  /** Points at the event's node on the map, or at none. */
  onHighlight: (nodeId: string | null) => void;
  onOpenProposals: () => void;
}

const SUMMARY_CLASS =
  'rounded-sm text-sm leading-snug break-words hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none';

/** Hovering or focusing the summary rings the event's store or product on the map. */
function highlightHandlers(nodeId: string | null, onHighlight: (nodeId: string | null) => void) {
  const off = () => onHighlight(null);
  const on = () => onHighlight(nodeId);
  return { onMouseEnter: on, onMouseLeave: off, onFocus: on, onBlur: off };
}

/** The summary, as a way to what it is about: the changes to review, or the page that shows it. */
function EventSummary({ event, onOpenProposals, onHighlight }: EventItemProps) {
  const handlers = highlightHandlers(eventNodeId(event), onHighlight);
  if (event.type === WorkspaceEventType.agent_change_proposed) {
    return (
      <button
        type="button"
        className={cn(SUMMARY_CLASS, 'text-start')}
        onClick={onOpenProposals}
        {...handlers}
      >
        {event.summary}
      </button>
    );
  }
  const route = eventRoute(event);
  if (!route) return <p className="text-sm leading-snug break-words">{event.summary}</p>;
  return (
    <Link to={route} className={SUMMARY_CLASS} {...handlers}>
      {event.summary}
    </Link>
  );
}

/**
 * One event: what happened, who did it and when, and more to read (a store's error in red).
 * Its summary leads to what it is about and rings its store or product on the map.
 */
export function EventItem(props: EventItemProps) {
  const { event } = props;
  const { icon: Icon, iconClass } = SEVERITY_PRESENTATION[event.severity];
  const isError = event.severity === WorkspaceEventSeverity.error;
  return (
    <li
      data-testid={AGENT_CONSOLE_TEST_IDS.eventItem}
      data-severity={event.severity}
      className="flex gap-2.5 border-b px-3 py-2.5 last:border-b-0"
    >
      <Icon className={cn('mt-0.5 size-4 shrink-0', iconClass)} aria-hidden="true" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <EventSummary {...props} />
        {event.detail && (
          <p
            className={cn(
              'text-xs break-words',
              isError ? 'text-destructive' : 'text-muted-foreground',
            )}
          >
            {event.detail}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {actorLabel(event)} · <RelativeTime value={event.occurredAt} />
        </p>
      </div>
    </li>
  );
}
