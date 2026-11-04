import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Page } from '@/components/layout/Page';
import { LoadMoreButton } from '@/components/lists/LoadMoreButton';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import {
  ActiveFilterChip,
  BulkActionBar,
  CATALOG_GAP_COPY,
  ImportProductsDialog,
  ProductFilters,
  type ProductListFilters,
  ProductsEmptyState,
  ProductsTable,
  ProductsTableSkeleton,
  ProductViewsBar,
  toStatusCounts,
  toStatusQuery,
  useCatalogStats,
  useListSelection,
  useProductListFilters,
  useProducts,
} from '@/features/catalog';
import type { Selection } from '@/hooks/useSelection';
import { pluralize } from '@/lib/format';
import { type Workspace, useCurrentWorkspace } from '@/features/workspaces';

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

function AddProductActions({ workspaceId }: { workspaceId: string | undefined }) {
  return (
    <>
      <ImportProductsDialog workspaceId={workspaceId} />
      <AddProductButton />
    </>
  );
}

export function ProductsPage() {
  const { workspace } = useCurrentWorkspace();
  const filters = useProductListFilters();
  const { data: stats } = useCatalogStats(workspace?.id);
  const counts = stats && toStatusCounts(stats);

  return (
    <Page
      name="Products"
      description="One catalog for every channel you sell on."
      actions={<AddProductActions workspaceId={workspace?.id} />}
    >
      {workspace && <ProductViewsBar workspaceId={workspace.id} filters={filters} />}
      <ProductFilters
        search={filters.search}
        onSearchChange={filters.setSearch}
        status={filters.status}
        onStatusChange={filters.setStatus}
        counts={counts}
      />
      {filters.gap && (
        <ActiveFilterChip label={CATALOG_GAP_COPY[filters.gap].label} onClear={filters.clearGap} />
      )}
      <ProductResults workspace={workspace} filters={filters} />
    </Page>
  );
}

interface ProductResultsProps {
  workspace: Workspace | undefined;
  filters: ProductListFilters;
}

function ProductResults({ workspace, filters }: ProductResultsProps) {
  const selection = useListSelection(filters);
  const products = useProducts({
    workspaceId: workspace?.id,
    search: filters.debouncedSearch,
    status: toStatusQuery(filters.status),
    gap: filters.gap,
  });

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
        actions={<AddProductActions workspaceId={workspace?.id} />}
      />
    );
  }
  return (
    <>
      <ResultCount count={products.products.length} hasMore={products.hasNextPage} />
      <ProductsTable
        products={products.products}
        currency={workspace?.currency ?? ''}
        isRefreshing={products.isPlaceholderData}
        selection={selection}
      />
      {products.hasNextPage && (
        <LoadMoreButton
          isLoading={products.isFetchingNextPage}
          onLoadMore={() => void products.fetchNextPage()}
        />
      )}
      {workspace && <SelectionActions workspaceId={workspace.id} selection={selection} />}
    </>
  );
}

/** Tells screen readers how many products the filters left. */
function ResultCount({ count, hasMore }: { count: number; hasMore: boolean }) {
  return (
    <p className="sr-only" aria-live="polite">
      {hasMore ? 'Showing the first ' : 'Showing '}
      {pluralize(count, 'product')}
    </p>
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
      <BulkActionBar workspaceId={workspaceId} selection={selection} />
    </>
  );
}
