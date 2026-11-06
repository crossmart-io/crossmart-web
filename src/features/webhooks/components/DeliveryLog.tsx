import { useState } from 'react';
import type { WebhookDeliveryStatus } from '@/api/schema';
import { ErrorState } from '@/components/feedback/ErrorState';
import { FilterSelect } from '@/components/lists/FilterSelect';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { TablePagination } from '@/components/lists/TablePagination';
import { useUrlPagination } from '@/hooks/usePagination';
import { toEnumOptions } from '@/lib/enum';
import { useDeliveryStatusFilter } from '../hooks/useDeliveryStatusFilter';
import { useWebhookDeliveries } from '../hooks/useWebhookDeliveries';
import type { WebhookEndpointRef } from '../hooks/useWebhookEndpoints';
import { DELIVERY_COPY, DELIVERY_STATUS_LABELS } from '../webhooks.constants';
import { DeliveriesTable } from './DeliveriesTable';
import { DeliveryDetailSheet } from './DeliveryDetailSheet';

const STATUS_OPTIONS = toEnumOptions<WebhookDeliveryStatus>(DELIVERY_STATUS_LABELS);
const HEADING_ID = 'webhook-delivery-log';

/** The endpoint's deliveries, filtered by status, with each one's details in a sheet. */
export function DeliveryLog({ endpointRef }: { endpointRef: WebhookEndpointRef }) {
  const { status, setStatus } = useDeliveryStatusFilter();
  const [openDeliveryId, setOpenDeliveryId] = useState<string>();
  return (
    <section className="flex flex-col gap-4" aria-labelledby={HEADING_ID}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 id={HEADING_ID} className="font-heading text-lg font-semibold">
            {DELIVERY_COPY.title}
          </h2>
          <p className="text-sm text-muted-foreground">{DELIVERY_COPY.description}</p>
        </div>
        <FilterSelect
          options={STATUS_OPTIONS}
          value={status}
          onChange={setStatus}
          anyLabel={DELIVERY_COPY.anyStatus}
          label={DELIVERY_COPY.filterLabel}
        />
      </div>
      <DeliveryResults endpointRef={endpointRef} status={status} onOpen={setOpenDeliveryId} />
      <DeliveryDetailSheet
        endpointRef={endpointRef}
        deliveryId={openDeliveryId}
        onClose={() => setOpenDeliveryId(undefined)}
      />
    </section>
  );
}

interface DeliveryResultsProps {
  endpointRef: WebhookEndpointRef;
  status: WebhookDeliveryStatus | undefined;
  onOpen: (deliveryId: string) => void;
}

function DeliveryResults({ endpointRef, status, onOpen }: DeliveryResultsProps) {
  const pagination = useUrlPagination();
  const deliveries = useWebhookDeliveries(endpointRef, status, pagination);
  if (deliveries.isError) {
    return (
      <ErrorState
        title={DELIVERY_COPY.loadFailed}
        error={deliveries.error}
        onRetry={deliveries.refetch}
      />
    );
  }
  if (deliveries.isPending) return <ListSkeleton label="Loading deliveries" />;
  if (deliveries.items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        {status ? DELIVERY_COPY.emptyFiltered : DELIVERY_COPY.empty}
      </p>
    );
  }
  return (
    <>
      <DeliveriesTable
        endpointRef={endpointRef}
        deliveries={deliveries.items}
        onOpen={onOpen}
        isRefreshing={deliveries.isPlaceholderData}
      />
      <TablePagination
        pagination={pagination}
        total={deliveries.total}
        pageCount={deliveries.pageCount}
        noun={DELIVERY_COPY.noun}
        pluralNoun={DELIVERY_COPY.nounPlural}
        isFetching={deliveries.isPlaceholderData}
      />
    </>
  );
}
