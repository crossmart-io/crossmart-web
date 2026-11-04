import { OrderStatus } from '@/api/schema';

export const ORDERS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/orders';
export const ORDER_ENDPOINT = '/api/v1/workspaces/{workspaceId}/orders/{orderId}';
export const ORDER_SEARCH_DEBOUNCE_MS = 300;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.OPEN]: 'Unfulfilled',
  [OrderStatus.PARTIALLY_FULFILLED]: 'Partly shipped',
  [OrderStatus.FULFILLED]: 'Shipped',
  [OrderStatus.CANCELLED]: 'Cancelled',
};
