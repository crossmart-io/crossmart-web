import { useParams } from 'react-router';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { type ResourcePageCopy, ResourcePage } from '@/components/layout/ResourcePage';
import { PAGE_PARENTS } from '@/config/navigation';
import { ROUTE_PARAMS } from '@/config/routes';
import { OrderLinesTable, OrderStatusBadge, useOrder } from '@/features/orders';
import { formatDateTime, formatMoney } from '@/lib/format';

const ORDER_PAGE_COPY: ResourcePageCopy = {
  name: 'Order',
  notFoundName: 'Order not found',
  notFound: 'This order does not exist in this workspace.',
  loadFailed: 'This order could not be loaded',
};

function Order({ workspaceId, orderId }: { workspaceId: string; orderId: string }) {
  const query = useOrder(workspaceId, orderId);
  return (
    <ResourcePage query={query} copy={ORDER_PAGE_COPY} parents={PAGE_PARENTS.orders}>
      {(order) => (
        <Page
          name={order.name}
          parents={PAGE_PARENTS.orders}
          title={
            <>
              <span>{order.name}</span>
              <OrderStatusBadge status={order.status} />
            </>
          }
          description={`${order.storeName} · ${formatDateTime(order.placedAt)} · ${formatMoney(order.total, order.currencyCode)}`}
        >
          <OrderLinesTable lines={order.lines} currency={order.currencyCode} />
        </Page>
      )}
    </ResourcePage>
  );
}

export function OrderPage() {
  const orderId = useParams()[ROUTE_PARAMS.orderId] ?? '';
  return (
    <WorkspaceGate>
      {(workspace) => <Order workspaceId={workspace.id} orderId={orderId} />}
    </WorkspaceGate>
  );
}
