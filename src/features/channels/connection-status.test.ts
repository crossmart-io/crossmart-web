import { ChannelConnectionStatus } from '@/api/schema';
import type { ChannelConnection } from './channels.types';
import {
  ChannelSetup,
  channelSetupOf,
  connectionsSummary,
  headlineStatus,
} from './connection-status';

const withStatus = (status: ChannelConnectionStatus, failedListings = 0) =>
  ({ status, failedListings }) as ChannelConnection;

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

describe('connectionsSummary', () => {
  const { CONNECTED, NEEDS_REAUTH, ERROR } = ChannelConnectionStatus;

  it.each([
    [[CONNECTED], '1 store connected'],
    [[CONNECTED, CONNECTED, CONNECTED], '3 stores connected'],
    [[CONNECTED, NEEDS_REAUTH], '1 of 2 stores needs reconnecting'],
    [[NEEDS_REAUTH], 'The store needs reconnecting'],
    [[NEEDS_REAUTH, NEEDS_REAUTH, ERROR], '2 of 3 stores need reconnecting · 1 has errors'],
    [[CONNECTED, ERROR], '1 of 2 stores has errors'],
  ])('sums up %j in one line', (statuses, expected) => {
    expect(connectionsSummary(statuses.map((status) => withStatus(status)))).toBe(expected);
  });

  it('counts listing errors across the stores', () => {
    expect(connectionsSummary([withStatus(CONNECTED, 2), withStatus(CONNECTED, 1)])).toBe(
      '2 stores connected · 3 listing errors',
    );
  });
});
