import { Boxes, Package, Share2 } from 'lucide-react';
import { ChannelConnectionStatus } from '@/api/schema';
import { ROUTES } from '@/config/routes';
import { useCatalogStats } from '@/features/catalog';
import { connectionsSummary, useChannelConnections } from '@/features/channels';
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
    <div className="grid gap-4 sm:grid-cols-3">
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
      <ChannelsTile workspaceId={workspaceId} />
    </div>
  );
}
