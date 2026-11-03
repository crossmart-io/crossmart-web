import type { SortOption } from '@/components/lists/sort-options';
import {
  ChannelProductSort,
  ChannelProductState,
  CompareAtMode,
  SortDirection,
  ListingStatus,
  ListingVisibility,
  PriceRounding,
  PriceWarning,
} from '@/api/schema';

const CONNECTION_ENDPOINT = '/api/v1/workspaces/{workspaceId}/channel-connections/{connectionId}';
export const CHANNEL_CONNECTION_ENDPOINT = CONNECTION_ENDPOINT;
export const PRICING_ENDPOINT = `${CONNECTION_ENDPOINT}/pricing` as const;
export const PRICING_PREVIEW_ENDPOINT = `${CONNECTION_ENDPOINT}/pricing/preview` as const;
export const SELECTION_ENDPOINT = `${CONNECTION_ENDPOINT}/product-selection` as const;
export const SELECTION_PREVIEW_ENDPOINT =
  `${CONNECTION_ENDPOINT}/product-selection/preview` as const;
export const SYNC_ENDPOINT = `${CONNECTION_ENDPOINT}/sync` as const;
export const CHANNEL_LISTINGS_ENDPOINT = `${CONNECTION_ENDPOINT}/listings` as const;
export const CHANNEL_PRODUCTS_ENDPOINT = `${CONNECTION_ENDPOINT}/products` as const;
export const PRODUCT_CHANNELS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/products/{productId}/channels';
export const PRODUCT_CHANNEL_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/products/{productId}/channels/{connectionId}';
export const ADD_STORE_PRODUCTS_ENDPOINT = `${CONNECTION_ENDPOINT}/products/add` as const;
export const REMOVE_STORE_PRODUCTS_ENDPOINT = `${CONNECTION_ENDPOINT}/products/remove` as const;
export const LISTING_OVERRIDE_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/products/{productId}/channels/{connectionId}/override';

/** Previews wait for typing to pause, so each keystroke is not a request. */
export const PREVIEW_DEBOUNCE_MS = 400;
export const SELECTION_PREVIEW_PAGE_SIZE = 10;
export const CHANNEL_LISTINGS_PAGE_SIZE = 25;
export const CHANNEL_PRODUCTS_PAGE_SIZE = 25;
export const CHANNEL_PRODUCTS_SEARCH_DEBOUNCE_MS = 300;
/** Products added to a store in one request; the API allows no more. */
export const STORE_PRODUCTS_BATCH_SIZE = 250;
/** Mirrors the API's bounds, so the form can say so before a round trip. */
export const PRICING_MIN_PERCENT = -90;
export const PRICING_MAX_PERCENT = 500;
export const PRICING_MAX_MARGIN_PERCENT = 1000;
export const OVERRIDE_TITLE_MAX_LENGTH = 255;
/** Variants shown on a channel card before "and N more". */
export const CHANNEL_CARD_VARIANT_LIMIT = 3;
/** Store icons a products table row shows before "+N". */
export const PRODUCT_STORE_ICONS_SHOWN = 4;

export const LISTINGS_FEEDBACK = {
  pricingSaved: 'Pricing rule saved',
  selectionSaved: 'Product selection saved',
  overrideSaved: 'Channel overrides saved',
  overrideCleared: 'Channel overrides removed',
  removedFromStore: 'Removed from the store',
} as const;

export const ROUNDING_OPTIONS: readonly { value: PriceRounding; label: string; example: string }[] =
  [
    { value: PriceRounding.none, label: 'None', example: '102.35' },
    { value: PriceRounding.ending_99, label: '.99', example: '102.99' },
    { value: PriceRounding.ending_95, label: '.95', example: '102.95' },
    { value: PriceRounding.whole, label: 'Whole', example: '103' },
  ];

export const COMPARE_AT_OPTIONS: readonly { value: CompareAtMode; label: string }[] = [
  { value: CompareAtMode.adjust, label: 'Adjust it like the price' },
  { value: CompareAtMode.keep, label: 'Keep the catalog’s compare-at price' },
  { value: CompareAtMode.omit, label: 'Don’t send a compare-at price' },
];

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  [ListingStatus.PENDING]: 'Pending',
  [ListingStatus.ACTIVE]: 'Active',
  [ListingStatus.INACTIVE]: 'Hidden',
  [ListingStatus.ERROR]: 'Error',
  [ListingStatus.DELISTED]: 'Delisted',
};

export const PRICE_WARNING_MESSAGES: Record<PriceWarning, string> = {
  [PriceWarning.missing_cost]: 'No cost set, so the price floor does not apply.',
  [PriceWarning.below_floor]: 'This manual price is below your price floor.',
  [PriceWarning.compare_at_dropped]:
    'The compare-at price is not above the price, so none is sent.',
  [PriceWarning.clamped_to_zero]: 'The rule would make the price negative; it is sent as zero.',
};

/** How the override sheet offers visibility: follow the product, or decide for this channel. */
export const FOLLOW_PRODUCT = 'follow';
export type VisibilityChoice = ListingVisibility | typeof FOLLOW_PRODUCT;
export const VISIBILITY_OPTIONS: readonly { value: VisibilityChoice; label: string }[] = [
  { value: FOLLOW_PRODUCT, label: 'Same as the product’s status' },
  { value: ListingVisibility.VISIBLE, label: 'Show on this channel' },
  { value: ListingVisibility.HIDDEN, label: 'Hide on this channel' },
];

/** What a store's automatic rule adds, besides the products added to it by hand. */
export enum SelectionMode {
  Off = 'off',
  All = 'all',
  Filtered = 'filtered',
}

export const SELECTION_MODE_LABELS: Record<SelectionMode, string> = {
  [SelectionMode.Off]: 'Off',
  [SelectionMode.All]: 'All products',
  [SelectionMode.Filtered]: 'Products matching filters',
};

/** The listings tab's filter: every product in the store, or those in one state. */
export const ALL_CHANNEL_PRODUCTS = 'all';
/** States of products in the store; excluded ones are not, so the tab does not offer them. */
export const IN_STORE_STATES = [
  ChannelProductState.listed,
  ChannelProductState.pending,
  ChannelProductState.failed,
  ChannelProductState.removing,
] as const;
export type InStoreState = (typeof IN_STORE_STATES)[number];
export type ChannelProductFilter = InStoreState | typeof ALL_CHANNEL_PRODUCTS;

export const CHANNEL_PRODUCT_STATE_LABELS: Record<ChannelProductState, string> = {
  [ChannelProductState.listed]: 'Live',
  [ChannelProductState.pending]: 'Waiting to publish',
  [ChannelProductState.failed]: 'Error',
  [ChannelProductState.removing]: 'Being removed',
  [ChannelProductState.excluded]: 'Not in this store',
};

/** What each state means, under its badge. */
export const CHANNEL_PRODUCT_STATE_HINTS: Record<ChannelProductState, string> = {
  [ChannelProductState.listed]: 'On the channel.',
  [ChannelProductState.pending]: 'Sync now publishes it.',
  [ChannelProductState.failed]: 'The last sync failed.',
  [ChannelProductState.removing]: 'Sync now removes it from the channel.',
  [ChannelProductState.excluded]: 'Not selected for this store.',
};

export const CHANNEL_PRODUCT_FILTERS: readonly { value: ChannelProductFilter; label: string }[] = [
  { value: ALL_CHANNEL_PRODUCTS, label: 'All' },
  ...IN_STORE_STATES.map((state) => ({
    value: state,
    label: CHANNEL_PRODUCT_STATE_LABELS[state],
  })),
];

export const CHANNEL_PRODUCT_SORTS: readonly [
  SortOption<ChannelProductSort>,
  ...SortOption<ChannelProductSort>[],
] = [
  {
    value: 'title-asc',
    label: 'Title A–Z',
    sort: ChannelProductSort.title,
    direction: SortDirection.asc,
  },
  {
    value: 'title-desc',
    label: 'Title Z–A',
    sort: ChannelProductSort.title,
    direction: SortDirection.desc,
  },
  {
    value: 'updated-desc',
    label: 'Recently updated',
    sort: ChannelProductSort.updatedAt,
    direction: SortDirection.desc,
  },
  {
    value: 'updated-asc',
    label: 'Least recently updated',
    sort: ChannelProductSort.updatedAt,
    direction: SortDirection.asc,
  },
];

/** Whether the override sheet edits a product in a store, or adds it to one with its overrides. */
export enum OverrideSheetMode {
  Edit = 'edit',
  Add = 'add',
}
