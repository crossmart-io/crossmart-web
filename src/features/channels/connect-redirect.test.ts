import { ChannelType } from '@/api/schema';
import { connectionFixture } from './testing/channel-connection.fixture';
import { connectedStoresUrl, readConnectOutcome } from './connect-redirect';

describe('readConnectOutcome', () => {
  it('reads a successful connection', () => {
    expect(readConnectOutcome(new URLSearchParams('connected=shopify&connectionId=c-1'))).toEqual({
      kind: 'connected',
      message: 'Shopify is connected',
      channel: ChannelType.shopify,
      connectionId: 'c-1',
      reconnected: false,
    });
  });

  it('reads a reconnect', () => {
    expect(
      readConnectOutcome(new URLSearchParams('connected=ebay&connectionId=c-1&reconnected=true')),
    ).toMatchObject({ connectionId: 'c-1', reconnected: true });
  });

  it('reads the older return that names only the channel', () => {
    expect(readConnectOutcome(new URLSearchParams('connected=shopify'))).toMatchObject({
      channel: ChannelType.shopify,
      connectionId: null,
      reconnected: false,
    });
  });

  it('explains each failure, and unknown ones generically', () => {
    expect(readConnectOutcome(new URLSearchParams('error=expired_state&channel=shopify'))).toEqual({
      kind: 'failed',
      message: 'The connection took too long and expired. Please try again.',
    });
    expect(readConnectOutcome(new URLSearchParams('error=<script>'))).toEqual({
      kind: 'failed',
      message: 'Something went wrong while connecting. Please try again.',
    });
  });

  it('ignores pages without a redirect outcome and unknown channels', () => {
    expect(readConnectOutcome(new URLSearchParams(''))).toBeNull();
    expect(readConnectOutcome(new URLSearchParams('connected=myspace'))).toBeNull();
  });
});

describe('connectedStoresUrl', () => {
  it('announces a store connected with credentials the way an OAuth callback does', () => {
    const connection = connectionFixture({ id: 'c-9', channel: ChannelType.falabella });
    const url = connectedStoresUrl({ connection, reconnected: true });

    expect(url).toBe('/stores?connected=falabella&connectionId=c-9&reconnected=true');
    expect(readConnectOutcome(new URL(url, 'http://app.test').searchParams)).toMatchObject({
      message: 'Falabella is connected',
      connectionId: 'c-9',
      reconnected: true,
    });
  });
});
