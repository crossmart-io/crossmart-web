import {
  CircleAlert,
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
 * Where a product stands on a store, as the map draws it: five groups of the listing states,
 * each with its own edge colour, line, icon and words, so colour is never the only cue.
 */
export enum MapStatus {
  Published = 'published',
  Pending = 'pending',
  NeedsDetails = 'needs_details',
  Failed = 'failed',
  NotListed = 'not_listed',
}

/** In the order counts are listed and a store's edge takes the first one it has. */
export const MAP_STATUS_ORDER: readonly MapStatus[] = [
  MapStatus.Published,
  MapStatus.Pending,
  MapStatus.NeedsDetails,
  MapStatus.Failed,
  MapStatus.NotListed,
];

/**
 * The worst first: a store's edge shows the most urgent status any of its products has. A
 * listing that needs details waits for the seller, so it outranks one that is on its way.
 */
export const MAP_STATUS_SEVERITY: readonly MapStatus[] = [
  MapStatus.Failed,
  MapStatus.NeedsDetails,
  MapStatus.Pending,
  MapStatus.Published,
  MapStatus.NotListed,
];

/**
 * The listing states each map status groups. Pending is what is on its way; needs details is
 * what waits for the seller to add something the marketplace requires.
 */
export const MAP_STATUS_MEMBERS: Record<MapStatus, readonly ListingDisplayState[]> = {
  [MapStatus.Published]: [ListingDisplayState.published],
  [MapStatus.Pending]: [
    ListingDisplayState.ready,
    ListingDisplayState.publishing,
    ListingDisplayState.removing,
  ],
  [MapStatus.NeedsDetails]: [ListingDisplayState.needs_details],
  [MapStatus.Failed]: [ListingDisplayState.failed],
  [MapStatus.NotListed]: [ListingDisplayState.draft, ListingDisplayState.removed],
};

export interface MapStatusPresentation {
  label: string;
  /** The status after a count on a compact card: "3 live", "1 not listed". */
  countLabel: string;
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
    countLabel: 'live',
    icon: CircleCheck,
    stroke: 'var(--success)',
    animated: false,
    iconClass: 'text-success',
  },
  [MapStatus.Pending]: {
    label: 'Pending',
    countLabel: 'pending',
    icon: LoaderCircle,
    stroke: 'var(--brand)',
    dash: '6 4',
    animated: true,
    iconClass: 'text-brand',
  },
  [MapStatus.NeedsDetails]: {
    label: 'Needs details',
    countLabel: 'needs details',
    icon: CircleAlert,
    stroke: 'var(--warning)',
    dash: '10 4 2 4',
    animated: false,
    iconClass: 'text-warning',
  },
  [MapStatus.Failed]: {
    label: 'Failed',
    countLabel: 'failed',
    icon: CircleX,
    stroke: 'var(--destructive)',
    animated: false,
    iconClass: 'text-destructive',
  },
  [MapStatus.NotListed]: {
    label: 'Not listed',
    countLabel: 'not listed',
    icon: CircleDashed,
    stroke: 'var(--muted-foreground)',
    dash: '2 5',
    animated: false,
    iconClass: 'text-muted-foreground',
  },
};

/** The kinds of node the maps draw; React Flow picks each one's component by it. */
export enum MapNodeType {
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
  rowGap: 20,
  /**
   * A store's card: its name, a line of the counts it has, and when it last synced (beside
   * which a store with failures offers Crossmart Agent).
   */
  storeLeafHeight: 104,
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
   * A map that fills a page's column shrinks far enough that up to eight stores fit whole; the
   * zoom controls bring a part of it closer.
   */
  fillMinZoom: 0.35,
  /** It may also grow a little past natural size, so a wide column is not left mostly empty. */
  fillMaxZoom: 1.25,
  fillPadding: 0.06,
  /** How long refitting the map takes when the column or the stores change. */
  fitDurationMs: 200,
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
  lastSync: 'Synced',
  neverSynced: 'Not synced yet',
  accountGraphLabel: 'Map of your catalog and stores',
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
  loadError: 'The map could not be loaded.',
  controlsLabel: 'Map zoom',
  nothingListed: 'No products to list yet',
  countSeparator: '·',
} as const;
