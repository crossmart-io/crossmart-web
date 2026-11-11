import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { ErrorState } from '@/components/feedback/ErrorState';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { TablePagination } from '@/components/lists/TablePagination';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import {
  ActiveFilterChip,
  BulkActionBar,
  CATALOG_GAP_COPY,
  PRODUCT_SORTS,
  ProductFilters,
  type ProductListFilters,
  ProductsEmptyState,
  ProductRowMenu,
  type ProductSummary,
  ProductsTable,
  ProductsTableSkeleton,
  ProductViewsBar,
  ProductViewTabs,
  toStatusCounts,
  toStatusQuery,
  useCatalogStats,
  useListSelection,
  useProductListFilters,
  useProducts,
} from '@/features/catalog';
import { useUrlPagination } from '@/hooks/usePagination';
import type { Selection } from '@/hooks/useSelection';
import { ImportProductsDialog } from '@/features/imports';
import { WorkspacePermission } from '@/api/schema';
import { hasPermission, type Workspace } from '@/features/workspaces';
import { ProductStoreFilterSelect, StoreMembershipMenu } from '@/features/listings';
import { BulkGenerateMenu } from '@/features/suggestions';
import { SortSelect } from '@/components/lists/SortSelect';

function AddProductButton() {
  return (
    <Button asChild>
      <Link to={ROUTES.newProduct}>
        <Plus data-icon="inline-start" />
        Add product
      </Link>
    </Button>
  );
}

/** Importing and adding products, for members who may edit the catalog. */
function AddProductActions({ workspace }: { workspace: Workspace }) {
  if (!hasPermission(workspace, WorkspacePermission.products_edit)) return null;
  const workspaceId = workspace.id;
  return (
    <>
      <ImportProductsDialog workspaceId={workspaceId} />
      <AddProductButton />
    </>
  );
}

export function ProductsPage() {
  return <WorkspaceGate>{(workspace) => <Products workspace={workspace} />}</WorkspaceGate>;
}

function Products({ workspace }: { workspace: Workspace }) {
  const filters = useProductListFilters();
  const { data: stats } = useCatalogStats(workspace.id);
  const counts = stats && toStatusCounts(stats);

  return (
    <Page name="Products" actions={<AddProductActions workspace={workspace} />}>
      <ProductViewTabs />
      <ProductViewsBar workspaceId={workspace.id} filters={filters} />
      <ProductFilters
        search={filters.search}
        onSearchChange={filters.setSearch}
        status={filters.status}
        onStatusChange={filters.setStatus}
        counts={counts}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <ProductStoreFilterSelect
            workspaceId={workspace.id}
            value={filters.store}
            onChange={filters.setStore}
          />
          {filters.gap && (
            <ActiveFilterChip
              label={CATALOG_GAP_COPY[filters.gap].label}
              onClear={filters.clearGap}
            />
          )}
        </div>
        <SortSelect options={PRODUCT_SORTS} value={filters.sort.value} onChange={filters.setSort} />
      </div>
      <ProductResults workspace={workspace} filters={filters} />
    </Page>
  );
}

/** Each row's menu, such as Mark as sold, for members who may edit products. */
function rowMenuFor(workspace: Workspace) {
  if (!hasPermission(workspace, WorkspacePermission.products_edit)) return undefined;
  return (product: ProductSummary) => (
    <ProductRowMenu workspaceId={workspace.id} product={product} />
  );
}

interface ProductResultsProps {
  workspace: Workspace;
  filters: ProductListFilters;
}

function ProductResults({ workspace, filters }: ProductResultsProps) {
  const selection = useListSelection(filters);
  const pagination = useUrlPagination();
  const products = useProducts(
    {
      workspaceId: workspace.id,
      search: filters.debouncedSearch,
      status: toStatusQuery(filters.status),
      gap: filters.gap,
      storeFilter: filters.store.filter,
      storeId: filters.store.storeId,
      sort: filters.sort.sort,
      direction: filters.sort.direction,
    },
    pagination,
  );

  if (products.isError) {
    return (
      <ErrorState
        title="Products could not be loaded"
        error={products.error}
        onRetry={products.refetch}
      />
    );
  }
  if (products.isPending) return <ProductsTableSkeleton />;
  if (products.products.length === 0) {
    return (
      <ProductsEmptyState
        isFiltered={filters.isFiltered}
        onClearFilters={filters.clearAll}
        actions={<AddProductActions workspace={workspace} />}
      />
    );
  }
  return (
    <>
      <ProductsTable
        products={products.products}
        currency={workspace.currency}
        isRefreshing={products.isPlaceholderData}
        selection={selection}
        renderRowMenu={rowMenuFor(workspace)}
      />
      <TablePagination
        pagination={pagination}
        total={products.total}
        pageCount={products.pageCount}
        noun="product"
        isFetching={products.isPlaceholderData}
      />
      <SelectionActions workspaceId={workspace.id} selection={selection} />
    </>
  );
}

function SelectionActions({
  workspaceId,
  selection,
}: {
  workspaceId: string;
  selection: Selection;
}) {
  if (selection.ids.size === 0) return null;
  return (
    <>
      {/* Room under the last row, so the floating bar never covers it. */}
      <div className="h-16" aria-hidden="true" />
      <BulkActionBar
        workspaceId={workspaceId}
        selection={selection}
        renderActions={(productIds) => (
          <>
            <StoreMembershipMenu workspaceId={workspaceId} productIds={productIds} />
            <BulkGenerateMenu workspaceId={workspaceId} productIds={productIds} />
          </>
        )}
      />
    </>
  );
}
