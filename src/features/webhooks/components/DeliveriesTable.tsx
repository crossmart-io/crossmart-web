import { ActionsTableHead } from '@/components/lists/ActionsTableHead';
import { RelativeTime } from '@/components/time/RelativeTime';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { formatDuration, formatResponseStatus } from '../delivery-format';
import type { WebhookDelivery, WebhookEndpointRef } from '../hooks/useWebhookEndpoints';
import { WEBHOOK_EVENT_COPY } from '../webhooks.constants';
import { DeliveryStatusCell } from './DeliveryStatusCell';
import { RedeliverButton } from './RedeliverButton';

interface DeliveriesTableProps {
  endpointRef: WebhookEndpointRef;
  deliveries: readonly WebhookDelivery[];
  /** Opens a delivery's details, with its payload. */
  onOpen: (deliveryId: string) => void;
  isRefreshing: boolean;
}

/** The endpoint's deliveries, newest first. Narrow screens fold the numbers away. */
export function DeliveriesTable({
  endpointRef,
  deliveries,
  onOpen,
  isRefreshing,
}: DeliveriesTableProps) {
  return (
    <div
      className={cn('rounded-lg border transition-opacity', isRefreshing && 'opacity-60')}
      aria-busy={isRefreshing}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">HTTP</TableHead>
            <TableHead className="hidden lg:table-cell">Duration</TableHead>
            <TableHead className="hidden lg:table-cell">Attempts</TableHead>
            <TableHead className="hidden sm:table-cell">Created</TableHead>
            <ActionsTableHead className="w-32" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => (
            <DeliveryRow
              key={delivery.id}
              endpointRef={endpointRef}
              delivery={delivery}
              onOpen={onOpen}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type DeliveryRowProps = Omit<DeliveriesTableProps, 'deliveries' | 'isRefreshing'> & {
  delivery: WebhookDelivery;
};

function DeliveryRow({ endpointRef, delivery, onOpen }: DeliveryRowProps) {
  return (
    <TableRow>
      <TableCell className="max-w-0 min-w-40">
        <div className="flex min-w-0 flex-col items-start gap-0.5">
          <button
            type="button"
            onClick={() => onOpen(delivery.id)}
            className="font-medium hover:underline focus-visible:underline"
          >
            {WEBHOOK_EVENT_COPY[delivery.eventType].label}
          </button>
          {delivery.error && (
            <span className="w-full truncate text-xs text-destructive" title={delivery.error}>
              {delivery.error}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <DeliveryStatusCell delivery={delivery} />
      </TableCell>
      <TableCell className="hidden font-mono text-sm tabular-nums md:table-cell">
        {formatResponseStatus(delivery.responseStatus)}
      </TableCell>
      <TableCell className="hidden text-muted-foreground tabular-nums lg:table-cell">
        {formatDuration(delivery.durationMs)}
      </TableCell>
      <TableCell className="hidden text-muted-foreground tabular-nums lg:table-cell">
        {delivery.attempts}
      </TableCell>
      <TableCell className="hidden text-muted-foreground sm:table-cell">
        <RelativeTime value={delivery.createdAt} />
      </TableCell>
      <TableCell className="text-right">
        <RedeliverButton endpointRef={endpointRef} delivery={delivery} />
      </TableCell>
    </TableRow>
  );
}
