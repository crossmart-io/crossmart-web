import { toChannelConnectionRoute } from '@/config/routes';
import { ChannelTab, CHANNEL_TABS, retiredChannelTabRoute, toChannelTab } from './channel-tabs';

describe('channel tabs', () => {
  it('has two tabs: the store’s listings and its settings', () => {
    expect(CHANNEL_TABS.map((tab) => tab.value)).toEqual([
      ChannelTab.Listings,
      ChannelTab.Settings,
    ]);
  });

  it.each([
    ['settings', ChannelTab.Settings],
    ['pricing', ChannelTab.Settings],
    [undefined, ChannelTab.Listings],
    ['unknown', ChannelTab.Listings],
    ['products', ChannelTab.Listings],
  ])('opens the tab the URL names (%s)', (segment, expected) => {
    expect(toChannelTab(segment)).toBe(expected);
  });

  it('sends an old link to the pricing tab to the pricing section of Settings', () => {
    expect(retiredChannelTabRoute('c-1', 'pricing')).toBe('/channels/c-1/settings#pricing');
  });

  it.each([['settings'], ['listings'], [undefined], ['unknown']])(
    'leaves a current or unknown tab where it is (%s)',
    (segment) => {
      expect(retiredChannelTabRoute('c-1', segment)).toBeNull();
    },
  );

  it('links to a connection, on a tab when one is given', () => {
    expect(toChannelConnectionRoute('c-1')).toBe('/channels/c-1');
    expect(toChannelConnectionRoute('c-1', ChannelTab.Settings)).toBe('/channels/c-1/settings');
  });
});
