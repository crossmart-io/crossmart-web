import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { ProductStoreFilter } from '@/api/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTE_QUERY, toProductsRoute } from '@/config/routes';
import type { ChannelConnection } from '@/features/channels/channels.types';
import { needsReconnect } from '@/features/channels/connection-status';
import { useChannelProductFilters } from '../hooks/useChannelProductFilters';
import { useEditorSearchParam } from '../hooks/useEditorSearchParam';
import { useAddStoreProducts, useRemoveStoreProducts } from '../hooks/useStoreProducts';
import type { ChannelProductCounts, ListingStore } from '../listings.types';
import type { ChannelProductRowActions } from './channel-product-list.types';
import { ChannelProductFilters } from './ChannelProductFilters';
import { ChannelProductList } from './ChannelProductList';
import { ListingEditorSheet } from './ListingEditorSheet';

interface ChannelProductsCardProps {
  workspaceId: string;
  /** The workspace's currency, which the products' own prices are in. */
  catalogCurrency: string;
  connection: ChannelConnection;
  canEdit: boolean;
}

/** The store as its rows need it: what its setup lacks, and whether it can take a retry. */
function listingStoreOf(workspaceId: string, connection: ChannelConnection): ListingStore {
  return {
    workspaceId,
    connectionId: connection.id,
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

/** What every row can do: open its listing, and for editors remove it or add it. */
function useRowActions(
  store: ListingStore,
  canEdit: boolean,
  onOpenListing: (productId: string) => void,
): ChannelProductRowActions {
  const add = useAddStoreProducts();
  const remove = useRemoveStoreProducts();
  const ref = { workspaceId: store.workspaceId, connectionId: store.connectionId };
  return {
    store,
    canEdit,
    onOpenListing,
    onRemove: canEdit
      ? (productId) => remove.mutateAsync({ ref, productIds: [productId] })
      : undefined,
    onAddBack: canEdit ? (productId) => add.mutate({ ref, productIds: [productId] }) : undefined,
  };
}

/**
 * The store's listings in four views (all, live, needing attention, not listed), searched and
 * sorted, each one request with counts for every tab. A product opens in the listing editor over
 * the list, named in the URL so it can be shared.
 */
export function ChannelProductsCard({
  workspaceId,
  catalogCurrency,
  connection,
  canEdit,
}: ChannelProductsCardProps) {
  const filters = useChannelProductFilters();
  const editor = useEditorSearchParam(ROUTE_QUERY.listingProduct);
  const rows = useRowActions(listingStoreOf(workspaceId, connection), canEdit, editor.open);
  const [counts, setCounts] = useState<ChannelProductCounts>();
  const query = {
    search: filters.search.debouncedValue || undefined,
    sort: filters.sort.sort,
    direction: filters.sort.direction,
  };
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <ChannelProductFilters filters={filters} counts={counts} />
          {canEdit && <AddProductsButton connectionId={connection.id} />}
        </div>
        <ChannelProductList filter={filters.query} query={query} rows={rows} onCounts={setCounts} />
        {editor.openId && (
          <ListingEditorSheet
            listingRef={{ workspaceId, connectionId: connection.id, productId: editor.openId }}
            catalogCurrency={catalogCurrency}
            canEdit={canEdit}
            showProductLink
            onClose={editor.close}
          />
        )}
      </CardContent>
    </Card>
  );
}
