import { ChannelConnectionStatus, ChannelFeature, ChannelType, ConnectFailure } from '@/api/schema';
import amazonLogo from './assets/logos/amazon.svg';
import ebayLogo from './assets/logos/ebay.svg';
import etsyLogo from './assets/logos/etsy.svg';
import googleLogo from './assets/logos/google.svg';
import shopifyLogo from './assets/logos/shopify.svg';
import tiktokLogo from './assets/logos/tiktok.svg';
import walmartLogo from './assets/logos/walmart.svg';

export const CHANNEL_CONNECTIONS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/channel-connections';
export const CHANNEL_AUTHORIZATIONS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/channel-connections/authorizations';
export const CHANNEL_DISCONNECT_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/channel-connections/{connectionId}/disconnect';
export const CHANNEL_IMPORTS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/channel-connections/{connectionId}/imports';

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

/** How the merchant names the account to connect, for channels connected through OAuth. */
export interface AccountPrompt {
  label: string;
  placeholder: string;
  /** Shown after the input, such as `.myshopify.com`. */
  suffix?: string;
  description: string;
}

export interface ConnectableChannel {
  type: ChannelType;
  account: AccountPrompt;
}

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
      account: {
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
