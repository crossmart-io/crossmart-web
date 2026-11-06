import { Package } from 'lucide-react';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { TablePagination } from '@/components/lists/TablePagination';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Pagination } from '@/hooks/usePagination';
import type { useChannelProducts } from '../hooks/useChannelProducts';
import type { ListingStore } from '../listings.types';
import { ChannelProductRow } from './ChannelProductRow';

const SKELETON_ROWS = 5;

interface ChannelProductsTableProps {
  products: ReturnType<typeof useChannelProducts>;
  pagination: Pagination;
  store: ListingStore;
  canEdit: boolean;
  /** Opens the product's listing editor over the list. */
  onOpenListing: (productId: string) => void;
  onRemove?: (productId: string) => Promise<unknown>;
  onAddBack?: (productId: string) => void;
}

function NoProducts() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Package />
        </EmptyMedia>
        <EmptyTitle>No products here</EmptyTitle>
        <EmptyDescription>
          Add products from their page or from the products table, or try another filter.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

/** The store's products with their state there, a page at a time. */
export function ChannelProductsTable({
  products,
  pagination,
  store,
  canEdit,
  onOpenListing,
  onRemove,
  onAddBack,
}: ChannelProductsTableProps) {
  if (products.isError) {
    return (
      <ErrorState
        title="Products could not be loaded"
        error={products.error}
        onRetry={products.refetch}
      />
    );
  }
  if (products.isPending) return <ListSkeleton label="Loading products" rows={SKELETON_ROWS} />;
  if (products.items.length === 0) return <NoProducts />;
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="w-48 sm:w-64">In this store</TableHead>
              <TableHead className="hidden w-36 sm:table-cell">Last synced</TableHead>
              <TableHead className="w-28">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.items.map((row) => (
              <ChannelProductRow
                key={row.product.id}
                row={row}
                store={store}
                canEdit={canEdit}
                onOpenListing={onOpenListing}
                onRemove={onRemove}
                onAddBack={onAddBack}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        pagination={pagination}
        total={products.total}
        pageCount={products.pageCount}
        noun="product"
        isFetching={products.isPlaceholderData}
      />
    </div>
  );
}
