import { ErrorState } from '@/components/feedback/ErrorState';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { TablePagination } from '@/components/lists/TablePagination';
import { connectionName, useChannelConnections } from '@/features/channels';
import {
  OrderFilterBar,
  OrdersEmptyState,
  OrdersTable,
  useOrderFilters,
  useOrders,
} from '@/features/orders';
import type { Workspace } from '@/features/workspaces';
import { useUrlPagination } from '@/hooks/usePagination';

type OrderFilters = ReturnType<typeof useOrderFilters>;

function OrderResults({ workspace, filters }: { workspace: Workspace; filters: OrderFilters }) {
  const pagination = useUrlPagination();
  const orders = useOrders(
    workspace.id,
    {
      search: filters.debouncedSearch || undefined,
      status: filters.status,
      connectionId: filters.storeId,
      direction: filters.sort.direction,
    },
    pagination,
  );
  if (orders.isError) {
    return (
      <ErrorState
        title="Orders could not be loaded"
        error={orders.error}
        onRetry={orders.refetch}
      />
    );
  }
  if (orders.isPending) return <ListSkeleton label="Loading orders" />;
  if (orders.orders.length === 0) {
    return <OrdersEmptyState isFiltered={filters.isFiltered} onClearFilters={filters.clearAll} />;
  }
  return (
    <>
      <OrdersTable orders={orders.orders} isRefreshing={orders.isPlaceholderData} />
      <TablePagination
        pagination={pagination}
        total={orders.total}
        pageCount={orders.pageCount}
        noun="order"
        isFetching={orders.isPlaceholderData}
      />
    </>
  );
}

function Orders({ workspace }: { workspace: Workspace }) {
  const filters = useOrderFilters();
  const connections = useChannelConnections(workspace.id);
  const stores = (connections.data ?? []).map((connection) => ({
    id: connection.id,
    name: connectionName(connection),
  }));
  return (
    <>
      <OrderFilterBar filters={filters} stores={stores} />
      <OrderResults workspace={workspace} filters={filters} />
    </>
  );
}

export function OrdersPage() {
  return (
    <Page
      name="Orders"
      description="Orders from every store. Each one reserves its stock everywhere."
    >
      <WorkspaceGate>{(workspace) => <Orders workspace={workspace} />}</WorkspaceGate>
    </Page>
  );
}
