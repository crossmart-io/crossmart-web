import { useParams } from 'react-router';
import { isNotFoundError } from '@/api/api-error';
import { ContentLoader } from '@/components/feedback/ContentLoader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { ROUTE_PARAMS } from '@/config/routes';
import { OrderLinesTable, OrderStatusBadge, useOrder } from '@/features/orders';
import { formatDateTime, formatMoney } from '@/lib/format';

const ORDER_PAGE_NAME = 'Order';

function Order({ workspaceId, orderId }: { workspaceId: string; orderId: string }) {
  const { data: order, isPending, error, refetch } = useOrder(workspaceId, orderId);

  if (isNotFoundError(error)) {
    return (
      <Page name="Order not found" parents={PAGE_PARENTS.orders}>
        <p className="text-muted-foreground">This order does not exist in this workspace.</p>
      </Page>
    );
  }
  if (error) {
    return (
      <Page name={ORDER_PAGE_NAME} parents={PAGE_PARENTS.orders}>
        <ErrorState title="This order could not be loaded" error={error} onRetry={refetch} />
      </Page>
    );
  }
  if (isPending) return <ContentLoader />;

  return (
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
