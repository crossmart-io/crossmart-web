import {
  ChannelConnectionStatus,
  ChannelFeature,
  ChannelType,
  ConnectFailure,
  EbayCondition,
  EbayMarketplaceId,
} from '@/api/schema';
import amazonLogo from './assets/logos/amazon.svg';
import ebayLogo from './assets/logos/ebay.svg';
import etsyLogo from './assets/logos/etsy.svg';
import googleLogo from './assets/logos/google.svg';
import shopifyLogo from './assets/logos/shopify.svg';
import tiktokLogo from './assets/logos/tiktok.svg';
import walmartLogo from './assets/logos/walmart.svg';

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

export enum ChannelStatus {
  /** Its connector has shipped: it can be connected. */
  Available = 'available',
  InDevelopment = 'in_development',
  Planned = 'planned',
}

export const CHANNEL_STATUS_LABELS: Record<ChannelStatus, string> = {
  [ChannelStatus.Available]: 'Available',
  [ChannelStatus.InDevelopment]: 'In development',
  [ChannelStatus.Planned]: 'Planned',
};

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

export const CHANNEL_FEEDBACK = {
  disconnected: 'Channel disconnected',
  connectFailedTitle: 'Could not connect',
} as const;

/** Single-colour marks are painted in the text colour, so they stay visible in dark mode. */
export const FOREGROUND_TINT = 'currentColor';

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

export interface AccountOption {
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
  description:
    'Every listing in this eBay store is sold under these policies and condition, and ships from this address.',
  ready: 'Ready to list.',
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
  manageNote: 'Opens eBay’s site; sandbox accounts manage policies on the sandbox site.',
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

export interface ChannelInfo {
  name: string;
  description: string;
  status: ChannelStatus;
  logo: ChannelLogo;
  /** Set once the channel's connector has shipped. */
  connect?: ConnectableChannel;
}

/** The roadmap as it really stands. Update a channel's status when its connector ships. */
export const CHANNELS: readonly ChannelInfo[] = [
  {
    name: 'Shopify',
    description: 'Sync products, stock and orders with your Shopify store.',
    status: ChannelStatus.Available,
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
    status: ChannelStatus.InDevelopment,
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
    status: ChannelStatus.Planned,
    logo: { src: googleLogo, tint: '#4285f4' },
  },
  {
    name: 'Etsy',
    description: 'Publish handmade and vintage listings with Etsy attributes.',
    status: ChannelStatus.Planned,
    logo: { src: etsyLogo, tint: '#f1641e' },
  },
  {
    name: 'Amazon',
    description: 'Create offers and listings in Seller Central.',
    status: ChannelStatus.Planned,
    logo: { src: amazonLogo },
  },
  {
    name: 'Walmart',
    description: 'Sell on Walmart Marketplace.',
    status: ChannelStatus.Planned,
    logo: { src: walmartLogo },
  },
  {
    name: 'TikTok Shop',
    description: 'Sell to TikTok shoppers from the same catalog.',
    status: ChannelStatus.Planned,
    logo: { src: tiktokLogo, tint: FOREGROUND_TINT },
  },
];

/** The channel a connection belongs to, for its name, logo and how to reconnect it. */
export function channelInfoFor(type: ChannelType): ChannelInfo | undefined {
  return CHANNELS.find((channel) => channel.connect?.type === type);
}

/** A channel card's logo tile, or the small one a table row shows per store. */
export enum ChannelLogoSize {
  Default = 'default',
  Small = 'small',
}
