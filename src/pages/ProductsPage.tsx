import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Page } from '@/components/layout/Page';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import {
  ActiveFilterChip,
  CATALOG_GAP_COPY,
  ImportProductsDialog,
  ProductFilters,
  type ProductListFilters,
  ProductsEmptyState,
  ProductsTable,
  ProductsTableSkeleton,
  toStatusQuery,
  useProductListFilters,
  useProducts,
} from '@/features/catalog';
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

  return (
    <Page
      name="Products"
      description="One catalog for every channel you sell on."
      actions={<AddProductActions workspaceId={workspace?.id} />}
    >
      <ProductFilters
        search={filters.search}
        onSearchChange={filters.setSearch}
        status={filters.status}
        onStatusChange={filters.setStatus}
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
      <ProductsTable products={products.products} currency={workspace?.currency ?? ''} />
      {products.hasNextPage && (
        <Button
          variant="outline"
          className="self-center"
          disabled={products.isFetchingNextPage}
          onClick={() => void products.fetchNextPage()}
        >
          {products.isFetchingNextPage ? 'Loading…' : 'Load more'}
        </Button>
      )}
    </>
  );
}
