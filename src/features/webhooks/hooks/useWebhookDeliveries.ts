import { useMutation } from '@tanstack/react-query';
import { api, fetchClient } from '@/api/client';
import type { components, WebhookDeliveryStatus } from '@/api/schema';
import { unwrap } from '@/api/unwrap';
import { useInFlightPolling } from '@/hooks/useInFlightPolling';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import {
  IN_FLIGHT_DELIVERY_STATUSES,
  WEBHOOK_DELIVERIES_ENDPOINT,
  WEBHOOK_DELIVERY_ENDPOINT,
  WEBHOOK_FEEDBACK,
  WEBHOOK_REDELIVER_ENDPOINT,
} from '../webhooks.constants';
import type { WebhookDelivery, WebhookEndpointRef } from './useWebhookEndpoints';

type DeliveryPage = components['schemas']['WebhookDeliveryPageDto'];
export type WebhookDeliveryDetail = components['schemas']['WebhookDeliveryDetailDto'];

const DELIVERY_QUERIES = [WEBHOOK_DELIVERIES_ENDPOINT, WEBHOOK_DELIVERY_ENDPOINT];

/** Whether a delivery on the page is still pending or retrying, so its result is still coming. */
function hasDeliveriesInFlight(page: DeliveryPage): boolean {
  return page.items.some((delivery) => IN_FLIGHT_DELIVERY_STATUSES.has(delivery.status));
}

/**
 * One numbered page of the endpoint's delivery log, newest first. It refetches while a delivery
 * is in flight, so a test event's result shows up within seconds.
 */
export function useWebhookDeliveries(
  ref: WebhookEndpointRef,
  status: WebhookDeliveryStatus | undefined,
  pagination: Pagination,
) {
  const refetchInterval = useInFlightPolling(hasDeliveriesInFlight);
  return usePagedList<WebhookDelivery, DeliveryPage>({
    endpoint: WEBHOOK_DELIVERIES_ENDPOINT,
    params: { ...ref, status },
    pagination,
    fetchPage: (page, signal) =>
      unwrap(
        fetchClient.GET(WEBHOOK_DELIVERIES_ENDPOINT, {
          params: { path: ref, query: { status, ...page } },
          signal,
        }),
      ),
    staleTime: 0,
    refetchInterval,
  });
}

function isDeliveryInFlight(delivery: WebhookDeliveryDetail): boolean {
  return IN_FLIGHT_DELIVERY_STATUSES.has(delivery.status);
}

/** One delivery with the JSON body it sends; nothing is fetched until one is picked. */
export function useWebhookDelivery(ref: WebhookEndpointRef, deliveryId: string | undefined) {
  const refetchInterval = useInFlightPolling(isDeliveryInFlight);
  return api.useQuery(
    'get',
    WEBHOOK_DELIVERY_ENDPOINT,
    { params: { path: { ...ref, deliveryId: deliveryId ?? '' } } },
    { enabled: Boolean(deliveryId), refetchInterval },
  );
}

/** Sends a delivery's event again, with the same event id. */
export function useRedeliverWebhook(ref: WebhookEndpointRef) {
  const refresh = useInvalidateEndpoints(DELIVERY_QUERIES);
  return useMutation<WebhookDelivery, Error, string>({
    meta: { successMessage: WEBHOOK_FEEDBACK.redelivered },
    mutationFn: (deliveryId) =>
      unwrap(
        fetchClient.POST(WEBHOOK_REDELIVER_ENDPOINT, { params: { path: { ...ref, deliveryId } } }),
      ),
    onSuccess: refresh,
  });
}
