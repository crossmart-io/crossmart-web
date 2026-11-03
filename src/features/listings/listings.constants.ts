import {
  CompareAtMode,
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
export const PRODUCT_CHANNELS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/products/{productId}/channels';
export const LISTING_OVERRIDE_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/products/{productId}/channels/{connectionId}/override';

/** Previews wait for typing to pause, so each keystroke is not a request. */
export const PREVIEW_DEBOUNCE_MS = 400;
export const SELECTION_PREVIEW_PAGE_SIZE = 10;
export const CHANNEL_LISTINGS_PAGE_SIZE = 25;
/** Mirrors the API's bounds, so the form can say so before a round trip. */
export const PRICING_MIN_PERCENT = -90;
export const PRICING_MAX_PERCENT = 500;
export const PRICING_MAX_MARGIN_PERCENT = 1000;
export const OVERRIDE_TITLE_MAX_LENGTH = 255;
/** Variants shown on a channel card before "and N more". */
export const CHANNEL_CARD_VARIANT_LIMIT = 3;

export const LISTINGS_FEEDBACK = {
  pricingSaved: 'Pricing rule saved',
  selectionSaved: 'Product selection saved',
  overrideSaved: 'Channel overrides saved',
  overrideCleared: 'Channel overrides removed',
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

/** Which products a connection lists, as the selection editor offers it. */
export enum SelectionMode {
  All = 'all',
  Filtered = 'filtered',
  Picked = 'picked',
}

export const SELECTION_MODE_LABELS: Record<SelectionMode, string> = {
  [SelectionMode.All]: 'All products',
  [SelectionMode.Filtered]: 'Products matching filters',
  [SelectionMode.Picked]: 'Only products I pick',
};
