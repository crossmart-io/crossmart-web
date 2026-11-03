import { Package } from 'lucide-react';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { LoadMoreButton } from '@/components/lists/LoadMoreButton';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { useChannelProducts } from '../hooks/useChannelProducts';
import { ChannelProductRow } from './ChannelProductRow';

const SKELETON_ROWS = 5;

interface ChannelProductsTableProps {
  products: ReturnType<typeof useChannelProducts>;
  onToggle?: (productId: string, include: boolean) => void;
  isSaving: boolean;
}

function NoProducts() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Package />
        </EmptyMedia>
        <EmptyTitle>No products here</EmptyTitle>
        <EmptyDescription>Try another filter, or clear the search.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

/** Every product with its state in this store, a page at a time. */
export function ChannelProductsTable({ products, onToggle, isSaving }: ChannelProductsTableProps) {
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
              <TableHead className="w-48">In this store</TableHead>
              <TableHead className="hidden w-36 sm:table-cell">Last synced</TableHead>
              <TableHead className="w-20">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.items.map((row) => (
              <ChannelProductRow
                key={row.product.id}
                row={row}
                onToggle={onToggle}
                isSaving={isSaving}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      {products.hasNextPage && (
        <LoadMoreButton
          isLoading={products.isFetchingNextPage}
          onLoadMore={() => void products.fetchNextPage()}
        />
      )}
    </div>
  );
}
