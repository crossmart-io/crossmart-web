import { useState } from 'react';
import { ErrorState } from '@/components/feedback/ErrorState';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { TablePagination } from '@/components/lists/TablePagination';
import { useUrlPagination } from '@/hooks/usePagination';
import { Page } from '@/components/layout/Page';
import {
  type InventoryItem,
  type InventoryListFilters,
  InventoryEmptyState,
  InventoryFilters,
  InventoryTable,
  StockHistorySheet,
  toStockLevelQuery,
  useInventory,
  useInventoryListFilters,
} from '@/features/inventory';
import { WorkspacePermission } from '@/api/schema';
import { hasPermission, type Workspace } from '@/features/workspaces';

export function InventoryPage() {
  const filters = useInventoryListFilters();

  return (
    <Page name="Inventory" description="Stock of every variant, and every change to it.">
      <InventoryFilters filters={filters} />
      <WorkspaceGate>
        {(workspace) => <InventoryResults workspace={workspace} filters={filters} />}
      </WorkspaceGate>
    </Page>
  );
}

interface InventoryResultsProps {
  workspace: Workspace;
  filters: InventoryListFilters;
}

function InventoryResults({ workspace, filters }: InventoryResultsProps) {
  const canAdjust = hasPermission(workspace, WorkspacePermission.inventory_edit);
  const [historyItem, setHistoryItem] = useState<InventoryItem | null>(null);
  const pagination = useUrlPagination();
  const inventory = useInventory(
    {
      workspaceId: workspace.id,
      search: filters.debouncedSearch,
      stockLevel: toStockLevelQuery(filters.stockLevel),
      sort: filters.sort.sort,
      direction: filters.sort.direction,
    },
    pagination,
  );
  // Show the row as it is now, so the history header follows adjustments made meanwhile.
  const openItem =
    inventory.items.find((item) => item.inventoryItemId === historyItem?.inventoryItemId) ??
    historyItem;

  if (inventory.isError) {
    return (
      <ErrorState
        title="Inventory could not be loaded"
        error={inventory.error}
        onRetry={inventory.refetch}
      />
    );
  }
  if (inventory.isPending) return <ListSkeleton label="Loading inventory" />;
  if (inventory.items.length === 0) {
    return (
      <InventoryEmptyState isFiltered={filters.isFiltered} onClearFilters={filters.clearAll} />
    );
  }
  return (
    <>
      <InventoryTable
        workspaceId={workspace.id}
        items={inventory.items}
        isRefreshing={inventory.isPlaceholderData}
        onOpenHistory={setHistoryItem}
        canAdjust={canAdjust}
      />
      <TablePagination
        pagination={pagination}
        total={inventory.total}
        pageCount={inventory.pageCount}
        noun="variant"
        isFetching={inventory.isPlaceholderData}
      />
      <StockHistorySheet
        workspaceId={workspace.id}
        item={openItem}
        onClose={() => setHistoryItem(null)}
        canAdjust={canAdjust}
      />
    </>
  );
}
