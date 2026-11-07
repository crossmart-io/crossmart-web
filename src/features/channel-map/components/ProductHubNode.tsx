import type { NodeProps } from '@xyflow/react';
import { ProductThumbnail } from '@/features/catalog/components/ProductThumbnail';
import { CHANNEL_MAP_COPY, MapHandleSide } from '../channel-map.constants';
import type { ProductNode, ProductNodeData } from '../channel-map.types';
import { MapHandle } from './MapHandle';

/** The product itself: its picture, its title and on how many stores it is live. */
export function ProductHubCard({ title, imageUrl, live, total }: ProductNodeData) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3 text-card-foreground shadow-sm">
      <ProductThumbnail url={imageUrl} alt="" className="size-12" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="line-clamp-2 text-sm font-semibold" title={title}>
          {title}
        </span>
        <span className="text-xs text-muted-foreground">
          {CHANNEL_MAP_COPY.liveIn(live, total)}
        </span>
      </div>
    </div>
  );
}

export function ProductHubNode({ data }: NodeProps<ProductNode>) {
  return (
    <>
      <ProductHubCard {...data} />
      <MapHandle side={MapHandleSide.Hub} />
    </>
  );
}
