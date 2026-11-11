import { ListChecks, type LucideIcon, Settings } from 'lucide-react';
import { PageSection, toStoreRoute, withSection } from '@/config/routes';

/** The sections of a channel connection's page, as they appear in its URL. */
export enum ChannelTab {
  Listings = 'listings',
  Settings = 'settings',
}

interface ChannelTabInfo {
  value: ChannelTab;
  label: string;
  icon: LucideIcon;
}

/** In page order: the store's listings, then the store's settings with its pricing rule. */
export const CHANNEL_TABS: readonly ChannelTabInfo[] = [
  { value: ChannelTab.Listings, label: 'Listings', icon: ListChecks },
  { value: ChannelTab.Settings, label: 'Settings', icon: Settings },
];

const DEFAULT_CHANNEL_TAB = ChannelTab.Listings;

/** Tabs the page no longer has, and the tab and section that took their place. */
const RETIRED_CHANNEL_TABS: Readonly<Record<string, { tab: ChannelTab; section: PageSection }>> = {
  /** Pricing was its own tab; the store-wide rule is now a section of Settings. */
  pricing: { tab: ChannelTab.Settings, section: PageSection.StorePricing },
};

/** The tab a URL segment names, or the default tab for a missing or unknown one. */
export function toChannelTab(segment: string | undefined): ChannelTab {
  const retired = segment === undefined ? undefined : RETIRED_CHANNEL_TABS[segment];
  if (retired) return retired.tab;
  return CHANNEL_TABS.find((tab) => tab.value === segment)?.value ?? DEFAULT_CHANNEL_TAB;
}

/**
 * Where an old link to a tab the page no longer has should land, scrolled to the section that
 * replaced it, or null for a current tab.
 */
export function retiredChannelTabRoute(
  connectionId: string,
  segment: string | undefined,
): string | null {
  const retired = segment === undefined ? undefined : RETIRED_CHANNEL_TABS[segment];
  if (!retired) return null;
  return withSection(toStoreRoute(connectionId, retired.tab), retired.section);
}
