import type { Node } from '@xyflow/react';
import type { ChannelLogo } from '@/features/channels/channels.constants';
import type { StoreListingHealth } from '@/features/listing-health/listing-health.types';
import type { ProductChannel } from '@/features/listings/listings.types';
import type { MapNodeType } from './channel-map.constants';
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

export type CatalogNodeData = { productCount: number | undefined };

export type StoreNodeData = { store: StoreListingHealth; counts: MapStatusCounts };

/** A channel that cannot be connected yet: drawn faintly, with no figures. */
export type GhostChannelNodeData = { name: string; logo: ChannelLogo };

export type ProductNode = Node<ProductNodeData, MapNodeType.Product>;
export type ProductChannelNode = Node<ProductChannelNodeData, MapNodeType.ProductChannel>;
export type CatalogNode = Node<CatalogNodeData, MapNodeType.Catalog>;
export type StoreNode = Node<StoreNodeData, MapNodeType.Store>;
export type GhostChannelNode = Node<GhostChannelNodeData, MapNodeType.GhostChannel>;

export type ProductMapNode = ProductNode | ProductChannelNode;
export type AccountMapNode = CatalogNode | StoreNode | GhostChannelNode;
