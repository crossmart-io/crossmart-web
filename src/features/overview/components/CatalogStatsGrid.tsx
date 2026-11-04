import { Boxes, PackageX, Package, Share2 } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useCatalogStats } from '@/features/catalog';
import { pluralize } from '@/lib/format';
import { StatTile } from './StatTile';

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
        to={ROUTES.products}
      />
      <StatTile
        label="Channels"
        value={0}
        detail="Shopify and eBay are coming next"
        icon={Share2}
        to={ROUTES.channels}
      />
    </div>
  );
}
