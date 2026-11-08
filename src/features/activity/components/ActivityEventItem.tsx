import { ActivityActorType, ActivityOutcome } from '@/api/schema';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { RelativeTime } from '@/components/time/RelativeTime';
import { cn } from '@/lib/utils';
import type { ActivityEvent } from '../activity.types';
import { toActorName, toAgentUserName } from '../activity-actor';
import { toSubjectRoute } from '../activity-subject';
import { splitSummary } from '../summary-parts';
import { ActorAvatar } from './ActorAvatar';

interface ActivityEventItemProps {
  event: ActivityEvent;
  /** The record whose page shows the event: links to it are left out, since it is already open. */
  pageSubjectId?: string;
  /** Smaller avatar and type, for side cards. */
  compact?: boolean;
}

/** One line of the log: who, what (linked when it still exists), when, and how it went. */
export function ActivityEventItem({
  event,
  pageSubjectId,
  compact = false,
}: ActivityEventItemProps) {
  const failed = event.outcome === ActivityOutcome.FAILED;

  return (
    <li className={cn('flex gap-3', compact ? 'py-2' : 'px-4 py-3')}>
      <ActorAvatar actor={event.actor} className={cn(compact && 'size-6')} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('min-w-0 text-sm break-words', !compact && 'font-medium')}>
            <EventSummary
              event={event}
              route={event.subject?.id === pageSubjectId ? undefined : toSubjectRoute(event)}
            />
          </p>
          {failed && <Badge variant="destructive">Failed</Badge>}
        </div>
        {failed && event.failureReason && (
          <p className="text-sm break-words text-destructive">{event.failureReason}</p>
        )}
        <p className="text-xs text-muted-foreground">
          <ActorName event={event} />
          <span aria-hidden="true"> · </span>
          <RelativeTime value={event.createdAt} />
        </p>
      </div>
    </li>
  );
}

/** The summary with each quoted name isolated, so right-to-left names keep their place. */
function SummaryText({ summary }: { summary: string }) {
  return splitSummary(summary).map((part, index) =>
    part.isUserContent ? <bdi key={index}>{part.text}</bdi> : part.text,
  );
}

function EventSummary({ event, route }: { event: ActivityEvent; route: string | undefined }) {
  if (!route) return <SummaryText summary={event.summary} />;
  return (
    <Link to={route} className="underline-offset-4 hover:underline">
      <SummaryText summary={event.summary} />
    </Link>
  );
}

/** ", approved by Lee" for a change an outside agent proposed and a person approved. */
function ApprovedBy({ name }: { name: string | null }) {
  if (!name) return null;
  return (
    <>
      , approved by <bdi>{name}</bdi>
    </>
  );
}

function ActorName({ event }: { event: ActivityEvent }) {
  const name = toActorName(event.actor);
  switch (event.actor.type) {
    case ActivityActorType.API_KEY:
      return (
        <span>
          <bdi>{name}</bdi> <span className="text-muted-foreground/80">(API key)</span>
        </span>
      );
    case ActivityActorType.AGENT:
      return (
        <span>
          <bdi>{name}</bdi>{' '}
          <span className="text-muted-foreground/80">
            (agent, for <bdi>{toAgentUserName(event.actor)}</bdi>
            <ApprovedBy name={event.actor.approvedByName} />)
          </span>
        </span>
      );
    default:
      return <bdi>{name}</bdi>;
  }
}
