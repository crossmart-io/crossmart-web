import {
  CircleCheck,
  CircleDashed,
  CircleX,
  LoaderCircle,
  List,
  type LucideIcon,
  Waypoints,
} from 'lucide-react';
import { ListingDisplayState } from '@/api/schema';

/**
 * Where a product stands on a store, as the map draws it: four groups of the listing states,
 * each with its own edge colour, line, icon and words, so colour is never the only cue.
 */
export enum MapStatus {
  Published = 'published',
  Pending = 'pending',
  Failed = 'failed',
  NotListed = 'not_listed',
}

/** In the order counts are listed and a store's edge takes the first one it has. */
export const MAP_STATUS_ORDER: readonly MapStatus[] = [
  MapStatus.Published,
  MapStatus.Pending,
  MapStatus.Failed,
  MapStatus.NotListed,
];

/** The worst first: a store's edge shows the most urgent status any of its products has. */
export const MAP_STATUS_SEVERITY: readonly MapStatus[] = [
  MapStatus.Failed,
  MapStatus.Pending,
  MapStatus.Published,
  MapStatus.NotListed,
];

/** The listing states each map status groups. `needs_details` waits for the seller: pending. */
export const MAP_STATUS_MEMBERS: Record<MapStatus, readonly ListingDisplayState[]> = {
  [MapStatus.Published]: [ListingDisplayState.published],
  [MapStatus.Pending]: [
    ListingDisplayState.needs_details,
    ListingDisplayState.ready,
    ListingDisplayState.publishing,
    ListingDisplayState.removing,
  ],
  [MapStatus.Failed]: [ListingDisplayState.failed],
  [MapStatus.NotListed]: [ListingDisplayState.draft, ListingDisplayState.removed],
};

export interface MapStatusPresentation {
  label: string;
  icon: LucideIcon;
  /** The edge's colour: a theme token, so it follows light and dark mode. */
  stroke: string;
  /** Dashes for the statuses that are not live, so the line differs without colour too. */
  dash?: string;
  /** The edge's dashes move while the store is still working on it. */
  animated: boolean;
  /** The icon's colour beside a count. */
  iconClass: string;
}

export const MAP_STATUS_PRESENTATION: Record<MapStatus, MapStatusPresentation> = {
  [MapStatus.Published]: {
    label: 'Published',
    icon: CircleCheck,
    stroke: 'var(--success)',
    animated: false,
    iconClass: 'text-success',
  },
  [MapStatus.Pending]: {
    label: 'Pending',
    icon: LoaderCircle,
    stroke: 'var(--warning)',
    dash: '6 4',
    animated: true,
    iconClass: 'text-warning',
  },
  [MapStatus.Failed]: {
    label: 'Failed',
    icon: CircleX,
    stroke: 'var(--destructive)',
    animated: false,
    iconClass: 'text-destructive',
  },
  [MapStatus.NotListed]: {
    label: 'Not listed',
    icon: CircleDashed,
    stroke: 'var(--muted-foreground)',
    dash: '2 5',
    animated: false,
    iconClass: 'text-muted-foreground',
  },
};

/** The kinds of node the maps draw; React Flow picks each one's component by it. */
export enum MapNodeType {
  Product = 'product',
  ProductChannel = 'product_channel',
  Catalog = 'catalog',
  Store = 'store',
  GhostChannel = 'ghost_channel',
}

/** Where an edge meets a hub (on its right) or a leaf (on its left). */
export enum MapHandleSide {
  Hub = 'hub',
  Leaf = 'leaf',
}

/** How a map is shown: as the graph, or as the same nodes in a list. */
export enum ChannelMapView {
  Graph = 'graph',
  List = 'list',
}

export const CHANNEL_MAP_VIEWS: readonly {
  value: ChannelMapView;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: ChannelMapView.Graph, label: 'Map', icon: Waypoints },
  { value: ChannelMapView.List, label: 'List', icon: List },
];

/** From Tailwind's `md` up there is room for the graph; below it the list is shown. */
export const GRAPH_MEDIA_QUERY = '(min-width: 48rem)';

/**
 * The column layout, in React Flow's units (pixels at zoom 1): the hub on the left, centred on
 * the column of stores to its right. Heights are what a node needs, so rows never overlap.
 */
export const MAP_LAYOUT = {
  hubWidth: 220,
  leafWidth: 330,
  columnGap: 140,
  rowGap: 24,
  productLeafHeight: 150,
  storeLeafHeight: 132,
  ghostLeafHeight: 56,
  /** Room above and below the graph in the canvas, together. */
  canvasPadding: 48,
  /** The canvas grows with the column, between these heights. */
  minCanvasHeight: 320,
  maxCanvasHeight: 1200,
  /** Room around the graph when it is fitted to the canvas, as a share of its size. */
  fitPadding: 0.08,
  /** Fitting never enlarges the graph past its natural size, nor shrinks it past legibility. */
  maxZoom: 1,
  minZoom: 0.45,
  /**
   * A map that fills a page's column never shrinks below this, so a node's labels stay
   * readable; what does not fit is reached by dragging the map.
   */
  fillMinZoom: 0.7,
  /** It may also grow a little past natural size, so a wide column is not left mostly empty. */
  fillMaxZoom: 1.25,
  fillPadding: 0.04,
} as const;

export const MAP_EDGE_WIDTH = 2;
/** An edge carrying a change to its store is drawn thicker, and pulses unless motion is reduced. */
export const PULSING_EDGE_WIDTH = 3;
export const PULSING_EDGE_CLASS = 'agent-sync';

/** How an agent's work on a node reads: each tone has its own ring, colour and words. */
export enum NodeActivityTone {
  Reading = 'reading',
  Waiting = 'waiting',
  Writing = 'writing',
  Done = 'done',
  Failed = 'failed',
}

export const NODE_ACTIVITY_CLASSES: Record<NodeActivityTone, { ring: string; pill: string }> = {
  [NodeActivityTone.Reading]: { ring: 'ring-2 ring-brand/60', pill: 'bg-brand text-white' },
  [NodeActivityTone.Waiting]: {
    ring: 'ring-2 ring-warning/70',
    pill: 'bg-warning text-white dark:text-black',
  },
  [NodeActivityTone.Writing]: { ring: 'ring-2 ring-brand', pill: 'bg-brand text-white' },
  [NodeActivityTone.Done]: { ring: 'ring-2 ring-success/60', pill: 'bg-success text-white' },
  [NodeActivityTone.Failed]: {
    ring: 'ring-2 ring-destructive/70',
    pill: 'bg-destructive text-white',
  },
};
/** Edges to channels that cannot be connected yet are drawn faintly. */
export const GHOST_EDGE_OPACITY = 0.35;

export const CHANNEL_MAP_COPY = {
  viewLabel: 'Show as',
  productTitle: 'Channel map',
  productDescription: 'Where this product is listed, and how it is doing on each store.',
  productGraphLabel: (title: string) => `Channel map of ${title}`,
  liveIn: (live: number, total: number) => `Live in ${live} of ${total} stores`,
  noStores: 'No store is connected yet.',
  connectStore: 'Connect a store',
  lastSync: 'Synced',
  neverSynced: 'Not synced yet',
  stock: (quantity: number) => `${quantity.toLocaleString()} in stock`,
  stockUntracked: 'Stock not tracked',
  overridden: 'Custom for this store',
  suggestions: (count: number) => (count === 1 ? '1 AI suggestion' : `${count} AI suggestions`),
  openDetails: (store: string, status: string) => `${store}: ${status}. Open details`,
  accountGraphLabel: 'Channel map of your catalog and stores',
  catalog: 'Catalog',
  products: (count: number) => (count === 1 ? '1 product' : `${count.toLocaleString()} products`),
  openCatalog: 'Open the products list',
  openStore: (store: string) => `Open ${store}’s listings`,
  statusCount: (store: string, status: string, count: number) =>
    `${store}: ${count.toLocaleString()} ${status.toLowerCase()}. Show them`,
  comingSoon: 'Coming soon',
  proposals: (count: number) =>
    count === 1
      ? '1 change waiting for you. Show it'
      : `${count} changes waiting for you. Show them`,
  loadError: 'The channel map could not be loaded.',
} as const;

/** The side panel opened from a store on the product's map. */
export const CHANNEL_PANEL_COPY = {
  description: 'This product on this store.',
  status: 'Status',
  lastSync: 'Last synced',
  price: 'Price',
  stock: 'Stock shown',
  overrides: 'Changed for this store',
  noOverrides: 'Everything follows the product.',
  editOverrides: 'Edit for this store',
  viewOnStore: 'View on the store',
  suggestionsTitle: 'AI suggestions',
} as const;
