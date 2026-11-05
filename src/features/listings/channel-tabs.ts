import { ListChecks, type LucideIcon, Settings, Tag } from 'lucide-react';

/** The sections of a channel connection's page, as they appear in its URL. */
export enum ChannelTab {
  Listings = 'listings',
  Pricing = 'pricing',
  Settings = 'settings',
}

interface ChannelTabInfo {
  value: ChannelTab;
  label: string;
  icon: LucideIcon;
}

/** In page order: the store's listings, their prices, then the connection and its rules. */
export const CHANNEL_TABS: readonly ChannelTabInfo[] = [
  { value: ChannelTab.Listings, label: 'Listings', icon: ListChecks },
  { value: ChannelTab.Pricing, label: 'Pricing', icon: Tag },
  { value: ChannelTab.Settings, label: 'Settings', icon: Settings },
];

const DEFAULT_CHANNEL_TAB = ChannelTab.Listings;

/** The tab a URL segment names, or the default tab for a missing or unknown one. */
export function toChannelTab(segment: string | undefined): ChannelTab {
  return CHANNEL_TABS.find((tab) => tab.value === segment)?.value ?? DEFAULT_CHANNEL_TAB;
}
