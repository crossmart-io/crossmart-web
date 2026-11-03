import { Card, CardContent } from '@/components/ui/card';
import { useChannelProductFilters } from '../hooks/useChannelProductFilters';
import { useChannelProducts } from '../hooks/useChannelProducts';
import { useRemoveStoreProducts } from '../hooks/useStoreProducts';
import { ALL_CHANNEL_PRODUCTS } from '../listings.constants';
import { ChannelProductFilters } from './ChannelProductFilters';
import { ChannelProductsTable } from './ChannelProductsTable';

interface ChannelProductsCardProps {
  workspaceId: string;
  connectionId: string;
  canEdit: boolean;
}

/**
 * The store's listings: every product it has or is getting, where each stands on the channel,
 * filtered by state, searched and sorted. Products are added from their own page.
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
  const remove = useRemoveStoreProducts();

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <ChannelProductFilters filters={filters} counts={products.counts} />
        <ChannelProductsTable
          products={products}
          onRemove={
            canEdit
              ? (productId) => remove.mutateAsync({ ref, productIds: [productId] })
              : undefined
          }
        />
      </CardContent>
    </Card>
  );
}
