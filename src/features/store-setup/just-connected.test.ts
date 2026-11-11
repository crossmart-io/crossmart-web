import { ChannelConnectionStatus, ChannelType, ProductStatus } from '@/api/schema';
import { connectionFixture } from '@/features/channels/testing/channel-connection.fixture';
import { activeProductsRule, justConnectedStore } from './just-connected';

const NOW = new Date('2026-11-11T10:00:00Z');
const FIVE_MINUTES_AGO = '2026-11-11T09:55:00Z';
const AN_HOUR_AGO = '2026-11-11T09:00:00Z';

describe('justConnectedStore', () => {
  it('finds the newest store connected moments ago on the channel', () => {
    const older = connectionFixture({ id: 'old', connectedAt: AN_HOUR_AGO });
    const fresh = connectionFixture({ id: 'new', connectedAt: FIVE_MINUTES_AGO });

    expect(justConnectedStore([older, fresh], ChannelType.shopify, NOW)?.id).toBe('new');
  });

  it('leaves alone a store connected long ago, as after a reconnect', () => {
    const store = connectionFixture({ connectedAt: AN_HOUR_AGO });

    expect(justConnectedStore([store], ChannelType.shopify, NOW)).toBeUndefined();
  });

  it('leaves alone a store that already adds products automatically', () => {
    const store = connectionFixture({
      connectedAt: FIVE_MINUTES_AGO,
      productSelection: { filter: {}, includeProductIds: [], excludeProductIds: [] },
    });

    expect(justConnectedStore([store], ChannelType.shopify, NOW)).toBeUndefined();
  });

  it('looks only at connected stores of that channel', () => {
    const stores = [
      connectionFixture({ connectedAt: FIVE_MINUTES_AGO, status: ChannelConnectionStatus.ERROR }),
      connectionFixture({ connectedAt: FIVE_MINUTES_AGO }),
    ];

    expect(justConnectedStore(stores, ChannelType.ebay, NOW)).toBeUndefined();
    expect(justConnectedStore(stores, ChannelType.shopify, NOW)?.status).toBe(
      ChannelConnectionStatus.CONNECTED,
    );
  });
});

describe('activeProductsRule', () => {
  it('adds every active product and keeps the products picked by hand', () => {
    const rule = { filter: null, includeProductIds: ['p-1'], excludeProductIds: ['p-2'] };

    expect(activeProductsRule(rule)).toEqual({
      filter: { status: ProductStatus.ACTIVE },
      includeProductIds: ['p-1'],
      excludeProductIds: ['p-2'],
    });
    expect(activeProductsRule(null).includeProductIds).toEqual([]);
  });
});
