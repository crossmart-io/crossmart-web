import {
  ChannelConnectionStatus,
  ChannelFeature,
  ChannelType,
  ConnectFailure,
  EbayCondition,
  EbayMarketplaceId,
  GoogleTargetCountry,
} from '@/api/schema';
import amazonLogo from './assets/logos/amazon.svg';
import bigcommerceLogo from './assets/logos/bigcommerce.svg';
import ebayLogo from './assets/logos/ebay.svg';
import etsyLogo from './assets/logos/etsy.svg';
import googleLogo from './assets/logos/google.svg';
import metaLogo from './assets/logos/meta.svg';
import pinterestLogo from './assets/logos/pinterest.svg';
import shopifyLogo from './assets/logos/shopify.svg';
import tiktokLogo from './assets/logos/tiktok.svg';
import walmartLogo from './assets/logos/walmart.svg';
import woocommerceLogo from './assets/logos/woocommerce.svg';

export const CHANNEL_CONNECTIONS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/channel-connections';
export const CHANNEL_CONNECTION_DETAIL_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/channel-connections/{connectionId}';
export const CHANNEL_AUTHORIZATIONS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/channel-connections/authorizations';
export const CHANNEL_DISCONNECT_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/channel-connections/{connectionId}/disconnect';
export const CHANNEL_IMPORTS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/channel-connections/{connectionId}/imports';
export const EBAY_LISTING_DEFAULTS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/channel-connections/{connectionId}/ebay/listing-defaults';
export const EBAY_POLICIES_OPT_IN_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/channel-connections/{connectionId}/ebay/business-policies/opt-in';
export const EBAY_POLICIES_REFRESH_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/channel-connections/{connectionId}/ebay/business-policies/refresh';
export const EBAY_DEFAULT_POLICIES_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/channel-connections/{connectionId}/ebay/business-policies/defaults';

export const GOOGLE_LISTING_SETUP_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/channel-connections/{connectionId}/google-merchant/listing-setup';

/** Where a channel stands on the roadmap, with the same labels as crossmart.io. */
export enum ChannelStatus {
  /** Its connector is live: merchants can connect it. */
  Live = 'live',
  /** Its connector is built but not open to merchants yet. */
  ComingSoon = 'coming_soon',
  Planned = 'planned',
  /** Open for a community-built connector. */
  Community = 'community',
}

export const CHANNEL_STATUS_LABELS: Record<ChannelStatus, string> = {
  [ChannelStatus.Live]: 'Live',
  [ChannelStatus.ComingSoon]: 'Coming soon',
  [ChannelStatus.Planned]: 'Planned',
  [ChannelStatus.Community]: 'Community',
};

/** The status of a channel merchants cannot connect yet. */
export type RoadmapStatus = Exclude<ChannelStatus, ChannelStatus.Live>;

/** Under the stores: one way to ask for a channel that cannot be connected yet. */
export const REQUEST_CHANNEL_COPY = {
  prompt: 'Sell somewhere else?',
  action: 'Request a marketplace',
} as const;

export const CONNECTION_STATUS_LABELS: Record<ChannelConnectionStatus, string> = {
  [ChannelConnectionStatus.CONNECTED]: 'Connected',
  [ChannelConnectionStatus.NEEDS_REAUTH]: 'Needs re-auth',
  [ChannelConnectionStatus.DISCONNECTED]: 'Disconnected',
  [ChannelConnectionStatus.ERROR]: 'Error',
};

/** What the merchant reads after a failed connection, by the reason the API sent back. */
export const CONNECT_FAILURE_MESSAGES: Record<ConnectFailure, string> = {
  [ConnectFailure.invalid_state]: 'That connection link is not valid. Start again from here.',
  [ConnectFailure.expired_state]: 'The connection took too long and expired. Please try again.',
  [ConnectFailure.invalid_signature]: 'The reply could not be verified, so nothing was connected.',
  [ConnectFailure.invalid_account]:
    'The reply was for a different account than the one you entered.',
  [ConnectFailure.access_denied]: 'The app was not approved, so nothing was connected.',
  [ConnectFailure.missing_scopes]:
    'Some permissions Crossmart needs were not granted. Please try again.',
  [ConnectFailure.not_permitted]: 'You can no longer manage this workspace.',
  [ConnectFailure.channel_unavailable]: 'The channel is not responding. Try again in a moment.',
  [ConnectFailure.plan_limit_reached]:
    'Your plan has no room for another store. See Settings, Billing.',
  [ConnectFailure.sandbox_claim_required]:
    'Claim this account first: stores can be connected once it is yours.',
  [ConnectFailure.session_required]:
    'Sign in to Crossmart in this browser, then connect the store again.',
  [ConnectFailure.unexpected]: 'Something went wrong while connecting. Please try again.',
};

/** What the store page says about each feature the store was connected without. */
export const MISSING_FEATURE_COPY: Record<ChannelFeature, { title: string; effect: string }> = {
  [ChannelFeature.storefront_visibility]: {
    title: 'Products are not shown in your Online Store yet',
    effect: 'Products are created in Shopify, but shoppers cannot see them.',
  },
  [ChannelFeature.order_sync]: {
    title: 'Orders are not read from this store yet',
    effect: 'Its sales do not reserve stock in your other stores.',
  },
};

/** Said once, under the missing features, however many there are. */
export const MISSING_FEATURES_COPY = {
  severalTitle: 'This store needs new permissions',
  approve: 'Approve them once in Shopify and come back; nothing else changes for the store.',
  askAdmin: 'A workspace admin can approve them in Shopify.',
  action: 'Approve in Shopify',
} as const;

/** The visible action that connects another store of a channel. */
export const CONNECT_STORE_LABEL = 'Connect a store';

/** The action that connects a channel's first store. */
export const CONNECT_LABEL = 'Connect';

/**
 * A channel that is coming soon, opened as a preview to the people who run this instance
 * (`me.platformAdmin`) so they can try its connector before merchants can.
 */
export const CHANNEL_PREVIEW_COPY = {
  connect: 'Connect (preview)',
  note: 'Preview: only platform admins see this.',
} as const;

/** The alert on a store that cannot sync until it is connected again. */
export const RECONNECT_COPY = {
  action: 'Reconnect',
  titles: {
    [ChannelConnectionStatus.NEEDS_REAUTH]: 'Reconnect this store to keep it in sync',
    [ChannelConnectionStatus.ERROR]: 'This store stopped syncing',
    [ChannelConnectionStatus.DISCONNECTED]: 'This store is disconnected',
  },
  /** When the API stored no reason of its own. */
  fallbackReason:
    'Crossmart lost access to the store. Nothing reaches it until you reconnect; your ' +
    'products and settings are kept.',
  askAdmin: 'A workspace admin can reconnect it.',
} as const;

export const CHANNEL_FEEDBACK = {
  disconnected: 'Store disconnected',
  connectFailedTitle: 'Could not connect',
} as const;

/** Single-colour marks are painted in the text colour, so they stay visible in dark mode. */
const FOREGROUND_TINT = 'currentColor';

export interface ChannelLogo {
  src: string;
  /** Tint for single-colour marks. Omit it for marks that carry their own colours. */
  tint?: string;
}

/** How the merchant names the account to connect: typed in, or picked from a list. */
export enum AccountPromptKind {
  Text = 'text',
  Select = 'select',
}

interface AccountPromptBase {
  label: string;
  placeholder: string;
  description: string;
}

/** A typed account, such as a Shopify store domain. */
export interface TextAccountPrompt extends AccountPromptBase {
  kind: AccountPromptKind.Text;
  /** Shown after the input, such as `.myshopify.com`. */
  suffix?: string;
}

interface AccountOption {
  /** The account handle sent to the API, such as `EBAY_US`. */
  value: string;
  label: string;
}

/** An account picked from a fixed list, such as an eBay marketplace. */
export interface SelectAccountPrompt extends AccountPromptBase {
  kind: AccountPromptKind.Select;
  options: readonly AccountOption[];
}

export type AccountPrompt = TextAccountPrompt | SelectAccountPrompt;

export interface ConnectableChannel {
  type: ChannelType;
  account: AccountPrompt;
  /** Whether Crossmart can import the channel's catalog into the workspace. */
  importsCatalog: boolean;
}

/** The eBay marketplaces Crossmart can connect, as the merchant picks them. */
export const EBAY_MARKETPLACE_LABELS: Record<EbayMarketplaceId, string> = {
  [EbayMarketplaceId.EBAY_US]: 'eBay US (USD)',
  [EbayMarketplaceId.EBAY_GB]: 'eBay UK (GBP)',
  [EbayMarketplaceId.EBAY_DE]: 'eBay Germany (EUR)',
  [EbayMarketplaceId.EBAY_AU]: 'eBay Australia (AUD)',
  [EbayMarketplaceId.EBAY_CA]: 'eBay Canada (CAD)',
  [EbayMarketplaceId.EBAY_FR]: 'eBay France (EUR)',
  [EbayMarketplaceId.EBAY_IT]: 'eBay Italy (EUR)',
  [EbayMarketplaceId.EBAY_ES]: 'eBay Spain (EUR)',
};

const EBAY_MARKETPLACE_OPTIONS: readonly AccountOption[] = Object.values(EbayMarketplaceId).map(
  (marketplaceId) => ({ value: marketplaceId, label: EBAY_MARKETPLACE_LABELS[marketplaceId] }),
);

/** What the store page says about an eBay account's business policies. */
export const EBAY_POLICIES_COPY = {
  label: 'Business policies',
  off: 'Business policies are off on this eBay account',
  separator: ' · ',
} as const;

/** An item's condition, as the merchant picks it for every listing. */
export const EBAY_CONDITION_LABELS: Record<EbayCondition, string> = {
  [EbayCondition.NEW]: 'New',
  [EbayCondition.LIKE_NEW]: 'Like new',
  [EbayCondition.NEW_OTHER]: 'New (other)',
  [EbayCondition.NEW_WITH_DEFECTS]: 'New with defects',
  [EbayCondition.CERTIFIED_REFURBISHED]: 'Certified refurbished',
  [EbayCondition.EXCELLENT_REFURBISHED]: 'Excellent, refurbished',
  [EbayCondition.VERY_GOOD_REFURBISHED]: 'Very good, refurbished',
  [EbayCondition.GOOD_REFURBISHED]: 'Good, refurbished',
  [EbayCondition.SELLER_REFURBISHED]: 'Seller refurbished',
  [EbayCondition.USED_EXCELLENT]: 'Used, excellent',
  [EbayCondition.USED_VERY_GOOD]: 'Used, very good',
  [EbayCondition.USED_GOOD]: 'Used, good',
  [EbayCondition.USED_ACCEPTABLE]: 'Used, acceptable',
  [EbayCondition.FOR_PARTS_OR_NOT_WORKING]: 'For parts or not working',
};

/**
 * Where merchants create and edit business policies. The web app does not know the API's eBay
 * environment, so this is eBay's production page; sandbox sellers use their sandbox site.
 */
export const EBAY_BUSINESS_POLICIES_URL = 'https://www.ebay.com/bp/manage';

/** What the listing defaults card says. */
export const EBAY_DEFAULTS_COPY = {
  title: 'Listing defaults',
  /** A product's own condition wins; this one lists the products without one. */
  conditionNote: 'For products without their own condition.',
  notReady: 'Choose a policy of each type and where items ship from before publishing.',
  choosePolicy: 'Choose a policy',
  noPolicies: 'No policies yet',
  save: 'Save defaults',
  saved: 'Listing defaults saved',
  optIn: 'Opt in to business policies',
  optedIn: 'Opted in. eBay may take a few minutes; create your policies on eBay, then refresh.',
  refresh: 'Refresh policies',
  refreshed: 'Policies read again from eBay',
  manage: 'Manage policies on eBay',
  policiesOff:
    'eBay lists items only under business policies. Create default policies here, or opt this account in and create your own on eBay.',
  policiesMissing: 'eBay needs a shipping, payment and return policy before it lists items.',
  createDefaults: 'Create default policies',
  createDefaultsNote:
    'Creates free shipping, immediate payment and 30-day returns on your eBay account. You can edit them on eBay later.',
  defaultsCreated: 'Default policies created and chosen',
} as const;

/** The country of a ship-from address: two capital letters (ISO 3166). */
export const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/;
export const POSTAL_CODE_MAX_LENGTH = 32;
export const CITY_MAX_LENGTH = 128;

/** How each kind of eBay business policy is named in the policy counts. */
export const EBAY_POLICY_KIND_LABELS = {
  fulfillment: 'shipping',
  payment: 'payment',
  return: 'return',
} as const;

/** The countries Google listings can target, with the currency they sell in. */
export const GOOGLE_COUNTRY_LABELS: Record<GoogleTargetCountry, string> = {
  [GoogleTargetCountry.US]: 'United States (USD)',
  [GoogleTargetCountry.GB]: 'United Kingdom (GBP)',
  [GoogleTargetCountry.CA]: 'Canada (CAD)',
  [GoogleTargetCountry.AU]: 'Australia (AUD)',
  [GoogleTargetCountry.DE]: 'Germany (EUR)',
  [GoogleTargetCountry.FR]: 'France (EUR)',
  [GoogleTargetCountry.IT]: 'Italy (EUR)',
  [GoogleTargetCountry.ES]: 'Spain (EUR)',
  [GoogleTargetCountry.NL]: 'Netherlands (EUR)',
  [GoogleTargetCountry.IL]: 'Israel (ILS)',
};

/** Where a product's handle goes in the product page address. */
export const PRODUCT_URL_HANDLE_PLACEHOLDER = '{handle}';
/** The usual product page path, appended to the account's website as a first suggestion. */
export const DEFAULT_PRODUCT_PATH = '/products/{handle}';

/** What the Google listing setup card says. */
export const GOOGLE_SETUP_COPY = {
  title: 'Listing setup',
  notReady: 'Choose the country and the product page address before publishing.',
  country: 'Country',
  countryNote: 'Listings are priced in its currency and written for it.',
  productUrl: 'Product page address',
  productUrlNote:
    'Your website’s address for a product, with {handle} where the product’s handle goes.',
  productUrlInvalid: 'Enter an https address that contains {handle}',
  homepageNotClaimed:
    'Google shows products only from a website you verified and claimed in Merchant Center. Claim your website there before publishing.',
  save: 'Save setup',
  saved: 'Google listing setup saved',
} as const;

interface ChannelInfoBase {
  name: string;
  description: string;
  logo: ChannelLogo;
  /** How to connect a store, set once the channel's connector is built. */
  connect?: ConnectableChannel;
}

/** A channel merchants can connect stores to today. */
export interface LiveChannelInfo extends ChannelInfoBase {
  status: ChannelStatus.Live;
  connect: ConnectableChannel;
}

/** A channel on the roadmap. One that is coming soon may already know how to connect a store. */
export interface RoadmapChannelInfo extends ChannelInfoBase {
  status: RoadmapStatus;
}

export type ChannelInfo = LiveChannelInfo | RoadmapChannelInfo;

/** The roadmap as it really stands, in crossmart.io's order. Update a status when it changes. */
export const CHANNELS: readonly ChannelInfo[] = [
  {
    name: 'Shopify',
    description: 'Sync products, stock and orders with your Shopify store.',
    status: ChannelStatus.Live,
    logo: { src: shopifyLogo, tint: '#5e8e3e' },
    connect: {
      type: ChannelType.shopify,
      importsCatalog: true,
      account: {
        kind: AccountPromptKind.Text,
        label: 'Store domain',
        placeholder: 'your-store',
        suffix: '.myshopify.com',
        description:
          'Find it in your Shopify admin under Settings, Domains. Your own domain will not work here.',
      },
    },
  },
  {
    name: 'eBay',
    description: 'List with eBay categories, item specifics and business policies.',
    status: ChannelStatus.Live,
    logo: { src: ebayLogo, tint: '#e53238' },
    connect: {
      type: ChannelType.ebay,
      importsCatalog: false,
      account: {
        kind: AccountPromptKind.Select,
        label: 'Marketplace',
        placeholder: 'Choose a marketplace',
        options: EBAY_MARKETPLACE_OPTIONS,
        description:
          'The eBay site you sell on. Connect each site separately; you sign in with the same eBay account.',
      },
    },
  },
  {
    name: 'Google Merchant Center',
    description: 'Show your products in Google Shopping and free listings.',
    status: ChannelStatus.ComingSoon,
    logo: { src: googleLogo, tint: '#4285f4' },
    connect: {
      type: ChannelType.google_merchant,
      importsCatalog: false,
      account: {
        kind: AccountPromptKind.Text,
        label: 'Merchant Center ID',
        placeholder: '123456789',
        description:
          'The number at the top right of Merchant Center (merchants.google.com). Sign in with a Google account that manages it.',
      },
    },
  },
  {
    name: 'Etsy',
    description: 'Publish handmade and vintage listings with Etsy attributes.',
    status: ChannelStatus.ComingSoon,
    logo: { src: etsyLogo, tint: '#f1641e' },
    connect: {
      type: ChannelType.etsy,
      importsCatalog: false,
      account: {
        kind: AccountPromptKind.Text,
        label: 'Shop name',
        placeholder: 'YourShopName',
        description:
          'The name in your shop’s address, etsy.com/shop/YourShopName. Sign in with the Etsy account that owns it.',
      },
    },
  },
  {
    name: 'Amazon',
    description: 'Create offers and listings in Seller Central.',
    status: ChannelStatus.Planned,
    logo: { src: amazonLogo, tint: FOREGROUND_TINT },
  },
  {
    name: 'Walmart',
    description: 'Sell on Walmart Marketplace.',
    status: ChannelStatus.Planned,
    logo: { src: walmartLogo, tint: FOREGROUND_TINT },
  },
  {
    name: 'TikTok Shop',
    description: 'Sell to TikTok shoppers from the same catalog.',
    status: ChannelStatus.Planned,
    logo: { src: tiktokLogo, tint: FOREGROUND_TINT },
  },
  {
    name: 'WooCommerce',
    description: 'Sync with a WordPress store.',
    status: ChannelStatus.Community,
    logo: { src: woocommerceLogo, tint: '#96588a' },
  },
  {
    name: 'BigCommerce',
    description: 'Sync with a BigCommerce store.',
    status: ChannelStatus.Community,
    logo: { src: bigcommerceLogo, tint: FOREGROUND_TINT },
  },
  {
    name: 'Meta Shops',
    description: 'Sell on Facebook and Instagram.',
    status: ChannelStatus.Community,
    logo: { src: metaLogo, tint: '#0467df' },
  },
  {
    name: 'Pinterest',
    description: 'Make your products shoppable on Pinterest.',
    status: ChannelStatus.Community,
    logo: { src: pinterestLogo, tint: '#bd081c' },
  },
];

export function isLiveChannel(channel: ChannelInfo): channel is LiveChannelInfo {
  return channel.status === ChannelStatus.Live;
}

/** The channel a connection belongs to, for its name, logo and how to reconnect it. */
export function channelInfoFor(type: ChannelType): ChannelInfo | undefined {
  return CHANNELS.find((channel) => channel.connect?.type === type);
}

/** A channel card's logo tile, or the small one a table row shows per store. */
export enum ChannelLogoSize {
  Default = 'default',
  Small = 'small',
}
