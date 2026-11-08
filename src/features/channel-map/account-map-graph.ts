import type { Edge } from '@xyflow/react';
import { type ChannelInfo, ChannelStatus } from '@/features/channels/channels.constants';
import type { StoreListingHealth } from '@/features/listing-health/listing-health.types';
import { GHOST_EDGE_OPACITY, MAP_LAYOUT, MapNodeType, MapStatus } from './channel-map.constants';
import type { AccountMapNode, MapOverlay } from './channel-map.types';
import { columnLayout, ORIGIN, pulsingEdge, STATIC_NODE, statusEdge } from './map-layout';
import { mapStatusCounts, storeMapStatus } from './map-status';

export const CATALOG_NODE_ID = 'catalog';
const CATALOG_HUB_HEIGHT = 96;
const GHOST_ID_PREFIX = 'ghost:';

export interface AccountMapInput {
  stores: readonly StoreListingHealth[];
  productCount: number | undefined;
  /** Every channel on the roadmap; those coming soon are drawn as ghosts. */
  channels: readonly ChannelInfo[];
  /** What a live view lays over the nodes and edges, such as an agent at work. */
  overlay?: MapOverlay;
}

export interface AccountMapGraph {
  nodes: AccountMapNode[];
  edges: Edge[];
  height: number;
}

/** Channels that cannot be connected yet but are close: shown faintly, with no figures. */
export function comingSoonChannels(channels: readonly ChannelInfo[]): ChannelInfo[] {
  return channels.filter((channel) => channel.status === ChannelStatus.ComingSoon);
}

/** A store's edge, pulsing while a change syncs to it. */
function storeEdge(store: StoreListingHealth, overlay: MapOverlay | undefined): Edge {
  const edge = statusEdge(
    CATALOG_NODE_ID,
    store.connectionId,
    storeMapStatus(mapStatusCounts(store.states)),
  );
  return overlay?.pulsingStoreIds.has(store.connectionId) ? pulsingEdge(edge) : edge;
}

function ghostEdge(target: string): Edge {
  const edge = statusEdge(CATALOG_NODE_ID, target, MapStatus.NotListed);
  return { ...edge, style: { ...edge.style, opacity: GHOST_EDGE_OPACITY } };
}

/** The catalog in the middle, each store to its right, then the channels coming soon. */
export function buildAccountMap({
  stores,
  productCount,
  channels,
  overlay,
}: AccountMapInput): AccountMapGraph {
  const ghosts = comingSoonChannels(channels);
  const layout = columnLayout(CATALOG_HUB_HEIGHT, [
    ...stores.map(() => MAP_LAYOUT.storeLeafHeight),
    ...ghosts.map(() => MAP_LAYOUT.ghostLeafHeight),
  ]);
  const position = (index: number) => layout.leaves[index] ?? ORIGIN;
  const storeNodes: AccountMapNode[] = stores.map((store, index) => ({
    id: store.connectionId,
    type: MapNodeType.Store,
    position: position(index),
    width: MAP_LAYOUT.leafWidth,
    data: {
      store,
      counts: mapStatusCounts(store.states),
      overlay: overlay?.nodes[store.connectionId],
    },
    ...STATIC_NODE,
  }));
  const ghostNodes: AccountMapNode[] = ghosts.map((channel, index) => ({
    id: `${GHOST_ID_PREFIX}${channel.name}`,
    type: MapNodeType.GhostChannel,
    position: position(stores.length + index),
    width: MAP_LAYOUT.leafWidth,
    data: { name: channel.name, logo: channel.logo },
    ...STATIC_NODE,
  }));
  const hub: AccountMapNode = {
    id: CATALOG_NODE_ID,
    type: MapNodeType.Catalog,
    position: layout.hub,
    width: MAP_LAYOUT.hubWidth,
    data: { productCount, overlay: overlay?.nodes[CATALOG_NODE_ID] },
    ...STATIC_NODE,
  };
  const edges = [
    ...stores.map((store) => storeEdge(store, overlay)),
    ...ghostNodes.map((node) => ghostEdge(node.id)),
  ];
  return { nodes: [hub, ...storeNodes, ...ghostNodes], edges, height: layout.height };
}
