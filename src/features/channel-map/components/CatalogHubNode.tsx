import type { NodeProps } from '@xyflow/react';
import { Library } from 'lucide-react';
import { Link } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/config/routes';
import { CHANNEL_MAP_COPY, MapHandleSide } from '../channel-map.constants';
import type { CatalogNode, CatalogNodeData } from '../channel-map.types';
import { MapHandle } from './MapHandle';

/** The catalog every store is fed from, with how many products it holds. Opens the products. */
export function CatalogHubCard({ productCount }: CatalogNodeData) {
  return (
    <Link
      to={ROUTES.products}
      aria-label={CHANNEL_MAP_COPY.openCatalog}
      className="flex items-center gap-3 rounded-xl border bg-card p-3 text-card-foreground shadow-sm transition-colors hover:border-ring/60 hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Library className="size-5" aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-semibold">{CHANNEL_MAP_COPY.catalog}</span>
        {productCount === undefined ? (
          <Skeleton className="h-4 w-20" />
        ) : (
          <span className="text-xs text-muted-foreground">
            {CHANNEL_MAP_COPY.products(productCount)}
          </span>
        )}
      </span>
    </Link>
  );
}

export function CatalogHubNode({ data }: NodeProps<CatalogNode>) {
  return (
    <>
      <CatalogHubCard {...data} />
      <MapHandle side={MapHandleSide.Hub} />
    </>
  );
}
