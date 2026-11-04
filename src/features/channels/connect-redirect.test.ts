import { readConnectOutcome } from './connect-redirect';

describe('readConnectOutcome', () => {
  it('reads a successful connection', () => {
    expect(readConnectOutcome(new URLSearchParams('connected=shopify'))).toEqual({
      kind: 'connected',
      message: 'Shopify is connected',
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
