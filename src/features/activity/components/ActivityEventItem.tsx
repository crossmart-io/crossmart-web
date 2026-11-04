import { ActivityActorType, ActivityOutcome } from '@/api/schema';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { RelativeTime } from '@/components/time/RelativeTime';
import { cn } from 'cn';
import type { ActivityEvent } from '../activity.types';
import { toActorName } from '../activity-actor';
import { toSubjectRoute } from '../activity-subject';
import { ActorAvatar } from './ActorAvatar';

interface ActivityEventItemProps {
  event: ActivityEvent;
  /** Hide the subject link, as on the subject's own page. */
  linkSubject?: boolean;
  /** Smaller avatar and type, for side cards. */
  compact?: boolean;
}

/** One line of the log: who, what (linked when it still exists), when, and how it went. */
export function ActivityEventItem({
  event,
  linkSubject = true,
  compact = false,
}: ActivityEventItemProps) {
  const failed = event.outcome === ActivityOutcome.FAILED;

  return (
    <li className={cn('flex gap-3', compact ? 'py-2' : 'px-4 py-3')}>
      <ActorAvatar actor={event.actor} className={cn(compact && 'size-6')} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('min-w-0 text-sm break-words', !compact && 'font-medium')}>
            <EventSummary event={event} route={linkSubject ? toSubjectRoute(event) : undefined} />
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

function EventSummary({ event, route }: { event: ActivityEvent; route: string | undefined }) {
  if (!route) return event.summary;
  return (
    <Link to={route} className="underline-offset-4 hover:underline">
      {event.summary}
    </Link>
  );
}

function ActorName({ event }: { event: ActivityEvent }) {
  const name = toActorName(event.actor);
  if (event.actor.type !== ActivityActorType.API_KEY) return <span>{name}</span>;
  return (
    <span>
      {name} <span className="text-muted-foreground/80">(API key)</span>
    </span>
  );
}
