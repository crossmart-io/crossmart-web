import { Boxes, PackageX, Package, Share2 } from 'lucide-react';
import { CatalogGap, ChannelConnectionStatus } from '@/api/schema';
import { ROUTES, toProductsRoute } from '@/config/routes';
import { useCatalogStats } from '@/features/catalog';
import { connectionsSummary, useChannelConnections } from '@/features/channels';
import { pluralize } from '@/lib/format';
import { StatTile } from './StatTile';

/** Stores that are linked, whatever their state; disconnected ones are gone. */
function ChannelsTile({ workspaceId }: { workspaceId: string }) {
  const { data: connections } = useChannelConnections(workspaceId);
  const stores = connections?.filter(
    (connection) => connection.status !== ChannelConnectionStatus.DISCONNECTED,
  );
  return (
    <StatTile
      label="Channels"
      value={stores?.length}
      detail={
        stores?.length ? connectionsSummary(stores) : 'Connect Shopify to sync products and stock'
      }
      icon={Share2}
      to={ROUTES.channels}
    />
  );
}

export function CatalogStatsGrid({ workspaceId }: { workspaceId: string }) {
  const { data: stats } = useCatalogStats(workspaceId);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        label="Products"
        value={stats?.products}
        detail={
          stats ? `${stats.activeProducts} active · ${stats.draftProducts} draft` : 'Loading…'
        }
        icon={Package}
        to={ROUTES.products}
      />
      <StatTile
        label="Variants"
        value={stats?.variants}
        detail="Every size, color and material you sell"
        icon={Boxes}
        to={ROUTES.products}
      />
      <StatTile
        label="Out of stock"
        value={stats?.outOfStockVariants}
        detail={
          stats?.outOfStockVariants
            ? `${pluralize(stats.outOfStockVariants, 'variant')} need restocking`
            : 'Everything tracked is in stock'
        }
        icon={PackageX}
        to={toProductsRoute({ gap: CatalogGap.out_of_stock })}
      />
      <ChannelsTile workspaceId={workspaceId} />
    </div>
  );
}
