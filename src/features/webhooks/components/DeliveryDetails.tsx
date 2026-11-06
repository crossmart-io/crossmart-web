import { formatDateTime } from '@/lib/format';
import { formatDuration, formatResponseStatus } from '../delivery-format';
import type { WebhookDeliveryDetail } from '../hooks/useWebhookDeliveries';
import { DetailItem } from './DetailItem';
import { DeliveryPayload } from './DeliveryPayload';
import { DeliveryStatusCell } from './DeliveryStatusCell';

/** Everything about one delivery: its attempts, the receiver's answer, and the payload. */
export function DeliveryDetails({ delivery }: { delivery: WebhookDeliveryDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-2 gap-4">
        <DetailItem label="Status">
          <DeliveryStatusCell delivery={delivery} />
        </DetailItem>
        <DetailItem label="Attempts">{delivery.attempts}</DetailItem>
        <DetailItem label="HTTP status">{formatResponseStatus(delivery.responseStatus)}</DetailItem>
        <DetailItem label="Duration">{formatDuration(delivery.durationMs)}</DetailItem>
        <DetailItem label="Created">{formatDateTime(delivery.createdAt)}</DetailItem>
        <DetailItem label="Last attempt">{formatDateTime(delivery.lastAttemptAt)}</DetailItem>
        <DetailItem label="Delivered">{formatDateTime(delivery.deliveredAt)}</DetailItem>
        <DetailItem label="Event ID">
          <code className="font-mono text-xs break-all">{delivery.eventId}</code>
        </DetailItem>
        {delivery.error && (
          <div className="col-span-2">
            <DetailItem label="Error">
              <span className="text-destructive">{delivery.error}</span>
            </DetailItem>
          </div>
        )}
      </dl>
      <DeliveryPayload payload={delivery.payload} />
    </div>
  );
}
