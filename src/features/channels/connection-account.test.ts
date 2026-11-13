import { EbayMarketplaceId, MercadoLibreSiteId } from '@/api/schema';
import { connectionCurrency, reconnectAccountHandle } from './connection-account';
import {
  connectionFixture,
  ebayConnectionFixture,
  mercadoLibreConnectionFixture,
} from './testing/channel-connection.fixture';

describe('reconnectAccountHandle', () => {
  it('is the store domain for Shopify and the marketplace for eBay', () => {
    expect(reconnectAccountHandle(connectionFixture())).toBe('demo-store.myshopify.com');
    expect(reconnectAccountHandle(ebayConnectionFixture())).toBe(EbayMarketplaceId.EBAY_GB);
  });

  it('is the country site for Mercado Libre, whose account id is the seller', () => {
    expect(reconnectAccountHandle(mercadoLibreConnectionFixture())).toBe(MercadoLibreSiteId.MLM);
  });
});

describe('connectionCurrency', () => {
  it('is the store’s or the marketplace’s currency, when known', () => {
    expect(connectionCurrency(connectionFixture())).toBe('USD');
    expect(connectionCurrency(ebayConnectionFixture())).toBe('GBP');
    expect(connectionCurrency(mercadoLibreConnectionFixture())).toBe('MXN');
    expect(connectionCurrency(connectionFixture({ shopify: null }))).toBeUndefined();
  });
});
