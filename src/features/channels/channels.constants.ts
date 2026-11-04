import amazonLogo from './assets/logos/amazon.svg';
import ebayLogo from './assets/logos/ebay.svg';
import etsyLogo from './assets/logos/etsy.svg';
import googleLogo from './assets/logos/google.svg';
import shopifyLogo from './assets/logos/shopify.svg';
import tiktokLogo from './assets/logos/tiktok.svg';
import walmartLogo from './assets/logos/walmart.svg';

export enum ChannelStatus {
  InDevelopment = 'in_development',
  Planned = 'planned',
}

export const CHANNEL_STATUS_LABELS: Record<ChannelStatus, string> = {
  [ChannelStatus.InDevelopment]: 'In development',
  [ChannelStatus.Planned]: 'Planned',
};

/** Paints a single-colour mark in the text colour, so it stays visible in dark mode. */
export const FOREGROUND_TINT = 'currentColor';

export interface ChannelLogo {
  src: string;
  /** Tint for single-colour marks. Omit it for marks that carry their own colours. */
  tint?: string;
}

export interface ChannelInfo {
  name: string;
  description: string;
  status: ChannelStatus;
  logo: ChannelLogo;
}

/** The roadmap as it really stands. Update a channel's status when its connector ships. */
export const CHANNELS: readonly ChannelInfo[] = [
  {
    name: 'Shopify',
    description: 'Sync products, stock and orders with your Shopify store.',
    status: ChannelStatus.InDevelopment,
    logo: { src: shopifyLogo, tint: '#5e8e3e' },
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
