import { WebhookDeliveryStatus, WebhookEventType } from '@/api/schema';

export const WEBHOOK_ENDPOINTS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/webhook-endpoints';
export const WEBHOOK_ENDPOINT_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/webhook-endpoints/{endpointId}';
export const WEBHOOK_ROTATE_SECRET_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/webhook-endpoints/{endpointId}/rotate-secret';
export const WEBHOOK_TEST_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/webhook-endpoints/{endpointId}/test';
export const WEBHOOK_DELIVERIES_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/webhook-endpoints/{endpointId}/deliveries';
export const WEBHOOK_DELIVERY_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/webhook-endpoints/{endpointId}/deliveries/{deliveryId}';
export const WEBHOOK_REDELIVER_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/webhook-endpoints/{endpointId}/deliveries/{deliveryId}/redeliver';

/** Where an endpoint stands, as its status badge says it. */
export enum WebhookEndpointState {
  Enabled = 'enabled',
  /** Turned off by someone. */
  Off = 'off',
  /** Turned off by Crossmart after failing deliveries. */
  Failing = 'failing',
}

export const ENDPOINT_STATE_LABELS: Record<WebhookEndpointState, string> = {
  [WebhookEndpointState.Enabled]: 'Enabled',
  [WebhookEndpointState.Off]: 'Off',
  [WebhookEndpointState.Failing]: 'Turned off after failures',
};

interface EventTypeCopy {
  label: string;
  description: string;
}

/** Every event as people read it. A new API event fails the build until it is described. */
export const WEBHOOK_EVENT_COPY: Record<WebhookEventType, EventTypeCopy> = {
  [WebhookEventType.order_created]: {
    label: 'Order created',
    description: 'A store sends an order Crossmart has not seen before',
  },
  [WebhookEventType.order_updated]: {
    label: 'Order updated',
    description: 'An order’s status, lines or total change',
  },
  [WebhookEventType.inventory_stock_changed]: {
    label: 'Stock changed',
    description: 'Stock moves for any reason: an order, an edit or an import',
  },
  [WebhookEventType.listing_published]: {
    label: 'Listing published',
    description: 'A product goes live on a store for the first time',
  },
  [WebhookEventType.listing_failed]: {
    label: 'Listing failed',
    description: 'A store refuses a listing, which stays in error until fixed',
  },
  [WebhookEventType.listing_removed]: {
    label: 'Listing removed',
    description: 'A listing is taken off its store',
  },
  [WebhookEventType.product_created]: {
    label: 'Product created',
    description: 'A product is added by hand, through the API or by an import',
  },
  [WebhookEventType.product_updated]: {
    label: 'Product updated',
    description: 'A product is edited, alone or in bulk',
  },
  [WebhookEventType.product_deleted]: {
    label: 'Product deleted',
    description: 'A product is deleted',
  },
  [WebhookEventType.webhook_test]: {
    label: 'Test event',
    description: 'Sent when you press Send test event',
  },
};

export interface WebhookEventGroup {
  label: string;
  eventTypes: readonly WebhookEventType[];
}

/**
 * The events an endpoint can subscribe to, by area. `webhook.test` is left out: it is sent on
 * request to one endpoint, whatever it subscribes to.
 */
export const WEBHOOK_EVENT_GROUPS: readonly WebhookEventGroup[] = [
  {
    label: 'Orders',
    eventTypes: [WebhookEventType.order_created, WebhookEventType.order_updated],
  },
  { label: 'Inventory', eventTypes: [WebhookEventType.inventory_stock_changed] },
  {
    label: 'Listings',
    eventTypes: [
      WebhookEventType.listing_published,
      WebhookEventType.listing_failed,
      WebhookEventType.listing_removed,
    ],
  },
  {
    label: 'Products',
    eventTypes: [
      WebhookEventType.product_created,
      WebhookEventType.product_updated,
      WebhookEventType.product_deleted,
    ],
  },
];

export const SUBSCRIBABLE_EVENT_TYPES: readonly WebhookEventType[] = WEBHOOK_EVENT_GROUPS.flatMap(
  (group) => group.eventTypes,
);

/** Event badges a table row shows before it folds the rest into "+3". */
export const VISIBLE_EVENT_BADGES = 2;

export const DELIVERY_STATUS_LABELS: Record<WebhookDeliveryStatus, string> = {
  [WebhookDeliveryStatus.PENDING]: 'Pending',
  [WebhookDeliveryStatus.RETRYING]: 'Retrying',
  [WebhookDeliveryStatus.SUCCEEDED]: 'Delivered',
  [WebhookDeliveryStatus.FAILED]: 'Failed',
};

/** Deliveries still in flight: the log refetches until none is. */
export const IN_FLIGHT_DELIVERY_STATUSES: ReadonlySet<WebhookDeliveryStatus> = new Set([
  WebhookDeliveryStatus.PENDING,
  WebhookDeliveryStatus.RETRYING,
]);

/** Spaces per level of the pretty-printed JSON payload. */
export const PAYLOAD_JSON_INDENT = 2;

export const WEBHOOK_DESCRIPTION_MAX_LENGTH = 500;

/** Toasts after endpoint changes. */
export const WEBHOOK_FEEDBACK = {
  deleted: 'Endpoint deleted',
  enabled: 'Endpoint turned on',
  disabled: 'Endpoint turned off',
  testSent: 'Test event sent. Its result shows in the delivery log.',
  redelivered: 'Event sent again',
  secretCopied: 'Secret copied to the clipboard',
} as const;

export const WEBHOOK_COPY = {
  pageDescription:
    'Crossmart POSTs events to your URLs as they happen: orders, stock, listings and products. Use them instead of polling from n8n, Zapier or your own backend.',
  noAccess: 'Only owners and admins can manage webhooks.',
  addEndpoint: 'Add endpoint',
  emptyTitle: 'No webhook endpoints yet',
  emptyDescription:
    'Add a URL and pick the events it should receive. Each request is signed, so your receiver can check it came from Crossmart.',
  readGuide: 'Read the webhooks guide',
  loadFailed: 'Webhook endpoints could not be loaded',
  failingNote: (failures: number) =>
    `Crossmart turned it off after ${failures} failed attempts in a row. Fix the receiver, send a test event, then turn it back on.`,
  secretTitle: 'Your signing secret',
  secretWarning:
    'Copy it now and store it where your receiver can read it. It will not be shown again.',
  secretVerify: 'Your receiver uses it to check the Crossmart-Signature header of each request.',
  secretVerifyLink: 'How to verify signatures',
  rotateTitle: 'Rotate the signing secret?',
  rotateDescription:
    'You get a new secret right away. For the next 24 hours deliveries are signed with both the new and the old secret, so you can deploy the new one without dropping events.',
  rotateConfirm: 'Rotate secret',
  disableTitle: 'Turn off this endpoint?',
  disableDescription:
    'It stops receiving events. Deliveries that are still pending or retrying fail, and events from while it is off are not sent.',
  disableConfirm: 'Turn off',
  deleteDescription:
    'It stops receiving events right away and its delivery log is deleted. This cannot be undone.',
  deleteConfirm: 'Delete endpoint',
  rotationOverlap: 'The previous secret also signs deliveries until',
} as const;

export const DELIVERY_COPY = {
  title: 'Delivery log',
  description: 'Every event sent to this endpoint in the last 30 days, newest first.',
  loadFailed: 'The delivery log could not be loaded',
  empty: 'No deliveries yet. Send a test event to see one here.',
  emptyFiltered: 'No deliveries with this status.',
  anyStatus: 'All statuses',
  filterLabel: 'Filter by status',
  redeliver: 'Redeliver',
  noun: 'delivery',
  nounPlural: 'deliveries',
  detailTitle: 'Delivery',
  payload: 'Payload',
  detailLoadFailed: 'This delivery could not be loaded',
} as const;
