import type { Node } from '@xyflow/react';
import type { ChannelLogo } from '@/features/channels/channels.constants';
import type { StoreListingHealth } from '@/features/listing-health/listing-health.types';
import type { ProductChannel } from '@/features/listings/listings.types';
import type { MapNodeType, NodeActivityTone } from './channel-map.constants';
import type { MapStatusCounts } from './map-status';

/** The product at the centre of its own map. A type, not an interface: React Flow's node data. */
export type ProductHub = {
  title: string;
  imageUrl: string | null;
};

export type ProductNodeData = ProductHub & {
  /** Stores it is published on, of `total`. */
  live: number;
  total: number;
};

export type ProductChannelNodeData = {
  channel: ProductChannel;
  /** AI suggestions waiting for review for this product on this store. */
  suggestionCount: number;
  onOpen: (connectionId: string) => void;
};

/** What an agent is doing on a node right now, in a few words: "Reading: List a store’s products". */
export type NodeActivity = { label: string; tone: NodeActivityTone };

/**
 * What a live view lays over a node: what the agent does there, how many of its changes wait
 * for approval there (a marker that opens them), and whether something else points at it.
 */
export type NodeOverlay = {
  activity: NodeActivity | null;
  proposals: number;
  highlighted: boolean;
  onOpenProposals?: () => void;
};

/** Overlays by node id, and the stores whose edge pulses while a change syncs to them. */
export type MapOverlay = {
  nodes: Readonly<Record<string, NodeOverlay>>;
  pulsingStoreIds: ReadonlySet<string>;
};

export type CatalogNodeData = { productCount: number | undefined; overlay?: NodeOverlay };

export type StoreNodeData = {
  store: StoreListingHealth;
  counts: MapStatusCounts;
  overlay?: NodeOverlay;
};

/** A channel that cannot be connected yet: drawn faintly, with no figures. */
export type GhostChannelNodeData = { name: string; logo: ChannelLogo };

export type ProductNode = Node<ProductNodeData, MapNodeType.Product>;
export type ProductChannelNode = Node<ProductChannelNodeData, MapNodeType.ProductChannel>;
export type CatalogNode = Node<CatalogNodeData, MapNodeType.Catalog>;
export type StoreNode = Node<StoreNodeData, MapNodeType.Store>;
export type GhostChannelNode = Node<GhostChannelNodeData, MapNodeType.GhostChannel>;

export type ProductMapNode = ProductNode | ProductChannelNode;
export type AccountMapNode = CatalogNode | StoreNode | GhostChannelNode;
