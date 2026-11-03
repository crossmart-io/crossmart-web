import { toChannelConnectionRoute } from '@/config/routes';
import { ChannelTab, toChannelTab } from './channel-tabs';

describe('channel tabs', () => {
  it.each([
    ['pricing', ChannelTab.Pricing],
    ['settings', ChannelTab.Settings],
    [undefined, ChannelTab.Products],
    ['unknown', ChannelTab.Products],
    ['listings', ChannelTab.Products],
  ])('opens the tab the URL names (%s)', (segment, expected) => {
    expect(toChannelTab(segment)).toBe(expected);
  });

  it('links to a connection, on a tab when one is given', () => {
    expect(toChannelConnectionRoute('c-1')).toBe('/channels/c-1');
    expect(toChannelConnectionRoute('c-1', ChannelTab.Pricing)).toBe('/channels/c-1/pricing');
  });
});
