import { WebhookDeliveryStatus, WebhookEventType } from '@/api/schema';
import type { WebhookDeliveryDetail } from '../hooks/useWebhookDeliveries';
import type { WebhookDelivery, WebhookEndpoint } from '../hooks/useWebhookEndpoints';

export const WORKSPACE_ID = 'ws-1';
export const ENDPOINT_ID = 'ep-1';
export const ENDPOINT_REF = { workspaceId: WORKSPACE_ID, endpointId: ENDPOINT_ID };

export function endpointFixture(overrides: Partial<WebhookEndpoint> = {}): WebhookEndpoint {
  return {
    id: ENDPOINT_ID,
    url: 'https://example.com/hooks',
    description: 'Orders to the warehouse',
    eventTypes: [WebhookEventType.order_created, WebhookEventType.inventory_stock_changed],
    enabled: true,
    disabledReason: null,
    disabledAt: null,
    consecutiveFailures: 0,
    previousSecretExpiresAt: null,
    createdAt: '2026-11-01T10:00:00Z',
    updatedAt: '2026-11-01T10:00:00Z',
    ...overrides,
  };
}

export function deliveryFixture(overrides: Partial<WebhookDelivery> = {}): WebhookDelivery {
  return {
    id: 'dl-1',
    endpointId: ENDPOINT_ID,
    eventId: 'ev-1',
    eventType: WebhookEventType.order_created,
    status: WebhookDeliveryStatus.SUCCEEDED,
    attempts: 1,
    responseStatus: 200,
    durationMs: 120,
    error: null,
    nextAttemptAt: null,
    lastAttemptAt: '2026-11-06T10:00:01Z',
    deliveredAt: '2026-11-06T10:00:01Z',
    createdAt: '2026-11-06T10:00:00Z',
    ...overrides,
  };
}

export function deliveryDetailFixture(delivery: WebhookDelivery): WebhookDeliveryDetail {
  return {
    ...delivery,
    payload: {
      id: delivery.eventId,
      type: delivery.eventType,
      createdAt: delivery.createdAt,
      workspaceId: WORKSPACE_ID,
      apiVersion: 'v1',
      data: { order: { id: 'order-1', name: '#1001' } },
    },
  };
}
