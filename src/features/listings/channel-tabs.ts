import { type LucideIcon, Package, Settings, Tag } from 'lucide-react';

/** The sections of a channel connection's page, as they appear in its URL. */
export enum ChannelTab {
  Products = 'products',
  Pricing = 'pricing',
  Settings = 'settings',
}

export interface ChannelTabInfo {
  value: ChannelTab;
  label: string;
  icon: LucideIcon;
}

/** In page order: the store's products and where they stand, their prices, then the connection. */
export const CHANNEL_TABS: readonly ChannelTabInfo[] = [
  { value: ChannelTab.Products, label: 'Products', icon: Package },
  { value: ChannelTab.Pricing, label: 'Pricing', icon: Tag },
  { value: ChannelTab.Settings, label: 'Settings', icon: Settings },
];

export const DEFAULT_CHANNEL_TAB = ChannelTab.Products;

/** The tab a URL segment names, or the default tab for a missing or unknown one. */
export function toChannelTab(segment: string | undefined): ChannelTab {
  return CHANNEL_TABS.find((tab) => tab.value === segment)?.value ?? DEFAULT_CHANNEL_TAB;
}
