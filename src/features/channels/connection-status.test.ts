import { ChannelConnectionStatus } from '@/api/schema';
import type { ChannelConnection } from './channels.types';
import { ChannelSetup, channelSetupOf, headlineStatus } from './connection-status';

const withStatus = (status: ChannelConnectionStatus) => ({ status }) as ChannelConnection;

describe('headlineStatus', () => {
  it('surfaces the connection that needs attention', () => {
    expect(
      headlineStatus([
        withStatus(ChannelConnectionStatus.CONNECTED),
        withStatus(ChannelConnectionStatus.NEEDS_REAUTH),
      ]),
    ).toBe(ChannelConnectionStatus.NEEDS_REAUTH);
    expect(headlineStatus([withStatus(ChannelConnectionStatus.CONNECTED)])).toBe(
      ChannelConnectionStatus.CONNECTED,
    );
    expect(headlineStatus([])).toBeUndefined();
  });
});

describe('channelSetupOf', () => {
  const connected = (lastSyncedAt: string | null) =>
    ({ status: ChannelConnectionStatus.CONNECTED, lastSyncedAt }) as ChannelConnection;

  it('tells a connected store that was never imported from one that was', () => {
    expect(channelSetupOf([])).toBe(ChannelSetup.NotConnected);
    expect(channelSetupOf([withStatus(ChannelConnectionStatus.DISCONNECTED)])).toBe(
      ChannelSetup.NotConnected,
    );
    expect(channelSetupOf([connected(null)])).toBe(ChannelSetup.Connected);
    expect(channelSetupOf([connected(null), connected('2026-11-03T09:00:00Z')])).toBe(
      ChannelSetup.Imported,
    );
  });
});
