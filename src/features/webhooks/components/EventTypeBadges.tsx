import type { WebhookEventType } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { VISIBLE_EVENT_BADGES, WEBHOOK_EVENT_COPY } from '../webhooks.constants';

interface EventTypeBadgesProps {
  eventTypes: readonly WebhookEventType[];
  /** Badges shown before the rest fold into "+3"; all of them when omitted. */
  limit?: number;
}

/** The events an endpoint subscribes to, by name. */
export function EventTypeBadges({ eventTypes, limit = eventTypes.length }: EventTypeBadgesProps) {
  const shown = eventTypes.slice(0, limit);
  const hidden = eventTypes.slice(limit);
  return (
    <ul className="flex flex-wrap gap-1" aria-label="Events">
      {shown.map((eventType) => (
        <li key={eventType}>
          <Badge variant="outline">{WEBHOOK_EVENT_COPY[eventType].label}</Badge>
        </li>
      ))}
      {hidden.length > 0 && (
        <li title={hidden.map((eventType) => WEBHOOK_EVENT_COPY[eventType].label).join(', ')}>
          <Badge variant="secondary">+{hidden.length}</Badge>
        </li>
      )}
    </ul>
  );
}

/** A table row's events: the first few, then a count. */
export function CompactEventTypeBadges({
  eventTypes,
}: {
  eventTypes: readonly WebhookEventType[];
}) {
  return <EventTypeBadges eventTypes={eventTypes} limit={VISIBLE_EVENT_BADGES} />;
}
