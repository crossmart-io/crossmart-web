import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ALL_STATUSES,
  ImportProductsDialog,
  ProductFilters,
  ProductsEmptyState,
  ProductsTable,
  ProductsTableSkeleton,
  SEARCH_DEBOUNCE_MS,
  type StatusFilter,
  toStatusQuery,
  useProducts,
} from '@/features/catalog';
import { useCurrentWorkspace } from '@/features/workspaces';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export function ProductsPage() {
  const { workspace } = useCurrentWorkspace();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>(ALL_STATUSES);
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);
  const products = useProducts({
    workspaceId: workspace?.id,
    search: debouncedSearch,
    status: toStatusQuery(status),
  });
  const importDialog = <ImportProductsDialog workspaceId={workspace?.id} />;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-muted-foreground">One catalog for every channel you sell on.</p>
        </div>
        {importDialog}
      </div>
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />
      {products.isPending ? (
        <ProductsTableSkeleton />
      ) : products.products.length === 0 ? (
        <ProductsEmptyState
          isFiltered={Boolean(debouncedSearch) || status !== ALL_STATUSES}
          action={importDialog}
        />
      ) : (
        <ProductsTable products={products.products} currency={workspace?.currency ?? ''} />
      )}
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
    </section>
  );
}
