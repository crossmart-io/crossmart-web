import { WebhookDeliveryStatus } from '@/api/schema';
import { RelativeTime } from '@/components/time/RelativeTime';
import type { WebhookDelivery } from '../hooks/useWebhookEndpoints';
import { DeliveryStatusBadge } from './DeliveryStatusBadge';

/** The delivery's status, and for one being retried, when the next attempt is due. */
export function DeliveryStatusCell({
  delivery,
}: {
  delivery: Pick<WebhookDelivery, 'status' | 'nextAttemptAt'>;
}) {
  const nextAttemptAt =
    delivery.status === WebhookDeliveryStatus.RETRYING ? delivery.nextAttemptAt : null;
  return (
    <div className="flex flex-col items-start gap-1">
      <DeliveryStatusBadge status={delivery.status} />
      {nextAttemptAt && (
        <span className="text-xs text-muted-foreground">
          Next attempt <RelativeTime value={nextAttemptAt} />
        </span>
      )}
    </div>
  );
}
