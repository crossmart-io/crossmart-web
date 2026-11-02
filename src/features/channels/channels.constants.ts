export enum ChannelStatus {
  InDevelopment = 'in_development',
  Planned = 'planned',
}

export const CHANNEL_STATUS_LABELS: Record<ChannelStatus, string> = {
  [ChannelStatus.InDevelopment]: 'In development',
  [ChannelStatus.Planned]: 'Planned',
};

export interface ChannelInfo {
  name: string;
  description: string;
  status: ChannelStatus;
  /** Brand color for the monogram tile. */
  color: string;
}

/** The roadmap as it really stands. Update a channel's status when its connector ships. */
export const CHANNELS: readonly ChannelInfo[] = [
  {
    name: 'Shopify',
    description: 'Sync products, stock and orders with your Shopify store.',
    status: ChannelStatus.InDevelopment,
    color: '#5e8e3e',
  },
  {
    name: 'eBay',
    description: 'List with eBay categories, item specifics and business policies.',
    status: ChannelStatus.InDevelopment,
    color: '#e53238',
  },
  {
    name: 'Google Merchant Center',
    description: 'Show your products in Google Shopping and free listings.',
    status: ChannelStatus.Planned,
    color: '#4285f4',
  },
  {
    name: 'Etsy',
    description: 'Publish handmade and vintage listings with Etsy attributes.',
    status: ChannelStatus.Planned,
    color: '#f1641e',
  },
  {
    name: 'Amazon',
    description: 'Create offers and listings in Seller Central.',
    status: ChannelStatus.Planned,
    color: '#ff9900',
  },
  {
    name: 'Walmart',
    description: 'Sell on Walmart Marketplace.',
    status: ChannelStatus.Planned,
    color: '#0071ce',
  },
  {
    name: 'TikTok Shop',
    description: 'Sell to TikTok shoppers from the same catalog.',
    status: ChannelStatus.Planned,
    color: '#000000',
  },
];
