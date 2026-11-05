import { unwrap } from '@/api/unwrap';
import { api, fetchClient } from '@/api/client';
import type { OrderStatus, SortDirection } from '@/api/schema';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import { ORDER_ENDPOINT, ORDERS_ENDPOINT } from '../orders.constants';
import type { OrderSummary } from '../orders.types';

interface OrdersQuery {
  search?: string;
  status?: OrderStatus;
  connectionId?: string;
  direction: SortDirection;
}

/** One numbered page of orders from every store. Refetched on each visit: orders keep coming. */
export function useOrders(workspaceId: string, query: OrdersQuery, pagination: Pagination) {
  const list = usePagedList<OrderSummary>({
    endpoint: ORDERS_ENDPOINT,
    params: { workspaceId, ...query },
    pagination,
    fetchPage: (page, signal) =>
      unwrap(
        fetchClient.GET(ORDERS_ENDPOINT, {
          params: { path: { workspaceId }, query: { ...query, ...page } },
          signal,
        }),
      ),
    staleTime: 0,
  });
  return { ...list, orders: list.items };
}

export function useOrder(workspaceId: string, orderId: string) {
  return api.useQuery('get', ORDER_ENDPOINT, { params: { path: { workspaceId, orderId } } });
}
