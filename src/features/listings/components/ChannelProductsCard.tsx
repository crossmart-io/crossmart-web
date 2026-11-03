import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { ProductStoreFilter } from '@/api/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toProductsRoute } from '@/config/routes';
import { useChannelProductFilters } from '../hooks/useChannelProductFilters';
import { useChannelProducts } from '../hooks/useChannelProducts';
import { useAddStoreProducts, useRemoveStoreProducts } from '../hooks/useStoreProducts';
import { ALL_CHANNEL_PRODUCTS } from '../listings.constants';
import { ChannelProductFilters } from './ChannelProductFilters';
import { ChannelProductsTable } from './ChannelProductsTable';

interface ChannelProductsCardProps {
  workspaceId: string;
  connectionId: string;
  canEdit: boolean;
}

/** Opens the products table on the products this store does not have yet, to add them. */
function AddProductsButton({ connectionId }: { connectionId: string }) {
  return (
    <Button asChild size="sm">
      <Link
        to={toProductsRoute({
          storeFilter: ProductStoreFilter.not_in_store,
          storeId: connectionId,
        })}
      >
        <Plus data-icon="inline-start" />
        Add products
      </Link>
    </Button>
  );
}

/**
 * The store's listings: every product it has or is getting, where each stands on the channel and
 * why it is there, filtered by state, searched and sorted. Products are added from the catalog.
 */
export function ChannelProductsCard({
  workspaceId,
  connectionId,
  canEdit,
}: ChannelProductsCardProps) {
  const ref = { workspaceId, connectionId };
  const filters = useChannelProductFilters();
  const products = useChannelProducts(ref, {
    state: filters.filter === ALL_CHANNEL_PRODUCTS ? undefined : filters.filter,
    search: filters.search.debouncedValue || undefined,
    sort: filters.sort.sort,
    direction: filters.sort.direction,
  });
  const add = useAddStoreProducts();
  const remove = useRemoveStoreProducts();

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <ChannelProductFilters filters={filters} counts={products.counts} />
          {canEdit && <AddProductsButton connectionId={connectionId} />}
        </div>
        <ChannelProductsTable
          products={products}
          onRemove={
            canEdit
              ? (productId) => remove.mutateAsync({ ref, productIds: [productId] })
              : undefined
          }
          onAddBack={
            canEdit ? (productId) => add.mutate({ ref, productIds: [productId] }) : undefined
          }
        />
      </CardContent>
    </Card>
  );
}
