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
import type { ListingStore } from '../listings.types';
import type { ChannelConnection } from '@/features/channels/channels.types';
import { needsReconnect } from '@/features/channels/connection-status';
import { ChannelProductFilters } from './ChannelProductFilters';
import { ChannelProductsTable } from './ChannelProductsTable';
import { useUrlPagination } from '@/hooks/usePagination';

interface ChannelProductsCardProps {
  workspaceId: string;
  connection: ChannelConnection;
  canEdit: boolean;
}

/** The store as its rows need it: what its setup lacks, and whether it can take a retry. */
function listingStoreOf(workspaceId: string, connection: ChannelConnection): ListingStore {
  return {
    workspaceId,
    connectionId: connection.id,
    missing: connection.publishReadiness.missing,
    connected: !needsReconnect(connection.status),
  };
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
  connection,
  canEdit,
}: ChannelProductsCardProps) {
  const connectionId = connection.id;
  const ref = { workspaceId, connectionId };
  const filters = useChannelProductFilters();
  const pagination = useUrlPagination();
  const products = useChannelProducts(
    ref,
    {
      state: filters.filter === ALL_CHANNEL_PRODUCTS ? undefined : filters.filter,
      search: filters.search.debouncedValue || undefined,
      sort: filters.sort.sort,
      direction: filters.sort.direction,
    },
    pagination,
  );
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
          pagination={pagination}
          store={listingStoreOf(workspaceId, connection)}
          canEdit={canEdit}
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
