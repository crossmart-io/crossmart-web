import type { Edge } from '@xyflow/react';
import type { ProductChannel } from '@/features/listings/listings.types';
import { MAP_LAYOUT, MapNodeType } from './channel-map.constants';
import type { ProductChannelNodeData, ProductHub, ProductMapNode } from './channel-map.types';
import { columnLayout, ORIGIN, STATIC_NODE, statusEdge } from './map-layout';
import { liveStoreCount, mapStatusOf } from './map-status';

export const PRODUCT_NODE_ID = 'product';
const PRODUCT_HUB_HEIGHT = 96;

export interface ProductMapInput {
  product: ProductHub;
  channels: readonly ProductChannel[];
  suggestionCounts: ReadonlyMap<string, number>;
  onOpen: ProductChannelNodeData['onOpen'];
}

export interface ProductMapGraph {
  nodes: ProductMapNode[];
  edges: Edge[];
  height: number;
}

/** The product in the middle, a node per store to its right, an edge in each store's status. */
export function buildProductMap({
  product,
  channels,
  suggestionCounts,
  onOpen,
}: ProductMapInput): ProductMapGraph {
  const layout = columnLayout(
    PRODUCT_HUB_HEIGHT,
    channels.map(() => MAP_LAYOUT.productLeafHeight),
  );
  const live = liveStoreCount(channels.map((channel) => channel.displayState));
  const hub: ProductMapNode = {
    id: PRODUCT_NODE_ID,
    type: MapNodeType.Product,
    position: layout.hub,
    width: MAP_LAYOUT.hubWidth,
    data: { ...product, live, total: channels.length },
    ...STATIC_NODE,
  };
  const leaves: ProductMapNode[] = channels.map((channel, index) => ({
    id: channel.connection.id,
    type: MapNodeType.ProductChannel,
    position: layout.leaves[index] ?? ORIGIN,
    width: MAP_LAYOUT.leafWidth,
    data: {
      channel,
      suggestionCount: suggestionCounts.get(channel.connection.id) ?? 0,
      onOpen,
    },
    ...STATIC_NODE,
  }));
  const edges = channels.map((channel) =>
    statusEdge(PRODUCT_NODE_ID, channel.connection.id, mapStatusOf(channel.displayState)),
  );
  return { nodes: [hub, ...leaves], edges, height: layout.height };
}
