import { ContentLoader } from '@/components/feedback/ContentLoader';
import { ErrorState } from '@/components/feedback/ErrorState';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useWebhookDelivery } from '../hooks/useWebhookDeliveries';
import type { WebhookEndpointRef } from '../hooks/useWebhookEndpoints';
import { DELIVERY_COPY, WEBHOOK_EVENT_COPY } from '../webhooks.constants';
import { DeliveryDetails } from './DeliveryDetails';
import { RedeliverButton } from './RedeliverButton';

interface DeliveryDetailSheetProps {
  endpointRef: WebhookEndpointRef;
  /** The delivery shown; the sheet is closed without one. */
  deliveryId: string | undefined;
  onClose: () => void;
}

/** One delivery over the log, with its JSON payload and a way to send it again. */
export function DeliveryDetailSheet({
  endpointRef,
  deliveryId,
  onClose,
}: DeliveryDetailSheetProps) {
  const { data: delivery, error, refetch } = useWebhookDelivery(endpointRef, deliveryId);
  return (
    <Sheet open={deliveryId !== undefined} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>
            {delivery ? WEBHOOK_EVENT_COPY[delivery.eventType].label : DELIVERY_COPY.detailTitle}
          </SheetTitle>
          <SheetDescription className="font-mono text-xs break-all">
            {delivery?.eventType ?? deliveryId}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          {error && (
            <ErrorState title={DELIVERY_COPY.detailLoadFailed} error={error} onRetry={refetch} />
          )}
          {!error && !delivery && <ContentLoader />}
          {delivery && <DeliveryDetails delivery={delivery} />}
        </div>
        {delivery && (
          <SheetFooter>
            <RedeliverButton endpointRef={endpointRef} delivery={delivery} />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
