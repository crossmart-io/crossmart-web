import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useRedeliverWebhook } from '../hooks/useWebhookDeliveries';
import type { WebhookDelivery, WebhookEndpointRef } from '../hooks/useWebhookEndpoints';
import { DELIVERY_COPY, WEBHOOK_EVENT_COPY } from '../webhooks.constants';

interface RedeliverButtonProps {
  endpointRef: WebhookEndpointRef;
  delivery: Pick<WebhookDelivery, 'id' | 'eventType'>;
}

/** Sends the delivery's event again, with the same event id. */
export function RedeliverButton({ endpointRef, delivery }: RedeliverButtonProps) {
  const redeliver = useRedeliverWebhook(endpointRef);
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={redeliver.isPending}
      onClick={() => redeliver.mutate(delivery.id)}
      aria-label={`${DELIVERY_COPY.redeliver} ${WEBHOOK_EVENT_COPY[delivery.eventType].label}`}
    >
      {redeliver.isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <RotateCw data-icon="inline-start" />
      )}
      {DELIVERY_COPY.redeliver}
    </Button>
  );
}
