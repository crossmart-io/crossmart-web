import { ChannelConnectionStatus } from '@/api/schema';
import type { ChannelConnection } from './channels.types';
import { headlineStatus } from './connection-status';

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
