import { ChannelType } from '@/api/schema';
import type { Product, ProductSale } from '../catalog.types';
import { isSold, markSoldDescription, markSoldMessage } from './mark-sold';

const SALE: ProductSale = {
  product: {} as Product,
  unitsCleared: 1,
  removedFromStores: [
    { connectionId: 'c-1', channel: ChannelType.ebay, displayName: 'eBay US' },
    { connectionId: 'c-2', channel: ChannelType.shopify, displayName: 'Main shop' },
  ],
  alreadySold: false,
};

describe('mark as sold', () => {
  it('is sold only with nothing available and in no store', () => {
    expect(isSold({ available: 0, storeNames: [] })).toBe(true);
    expect(isSold({ available: 0, storeNames: ['eBay US'] })).toBe(false);
    expect(isSold({ available: 1, storeNames: [] })).toBe(false);
  });

  it('names the stores it comes off', () => {
    expect(markSoldDescription(['eBay US', 'Main shop'])).toContain('eBay US and Main shop');
  });

  it('says what changed, or that nothing did', () => {
    expect(markSoldMessage(SALE)).toBe('Marked sold and removed from eBay US and Main shop.');
    expect(markSoldMessage({ ...SALE, alreadySold: true, removedFromStores: [] })).toBe(
      'Already sold. Nothing changed.',
    );
  });
});
