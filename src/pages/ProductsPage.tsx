import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
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
      <PageHeader
        title="Products"
        description="One catalog for every channel you sell on."
        actions={
          <>
            {importDialog}
            <Button asChild variant="default">
              <Link to={ROUTES.newProduct}>
                <Plus />
                Add product
              </Link>
            </Button>
          </>
        }
      />
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
