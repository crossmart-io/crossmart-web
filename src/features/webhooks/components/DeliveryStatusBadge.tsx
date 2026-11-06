import { WebhookDeliveryStatus } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { DELIVERY_STATUS_LABELS } from '../webhooks.constants';

const BADGE_VARIANTS = {
  [WebhookDeliveryStatus.PENDING]: 'outline',
  [WebhookDeliveryStatus.RETRYING]: 'warning',
  [WebhookDeliveryStatus.SUCCEEDED]: 'success',
  [WebhookDeliveryStatus.FAILED]: 'destructive',
} as const satisfies Record<
  WebhookDeliveryStatus,
  'outline' | 'warning' | 'success' | 'destructive'
>;

export function DeliveryStatusBadge({ status }: { status: WebhookDeliveryStatus }) {
  return (
    <Badge variant={BADGE_VARIANTS[status]}>
      <span data-dot className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {DELIVERY_STATUS_LABELS[status]}
    </Badge>
  );
}
