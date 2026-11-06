import { PriceSource } from '@/api/schema';
import { channelPriceRange } from './channel-price-range';
import type { ChannelVariant } from './listings.types';

function variant(price: string): ChannelVariant {
  return {
    variantId: price,
    title: price,
    quantity: null,
    price: {
      price,
      compareAtPrice: null,
      source: PriceSource.rule,
      steps: [],
      explanation: '',
      warnings: [],
      unitCost: null,
    },
  };
}

describe('channelPriceRange', () => {
  it('spans the lowest to the highest price, compared as numbers', () => {
    expect(channelPriceRange([variant('9.50'), variant('120.00'), variant('64.00')])).toEqual({
      min: '9.50',
      max: '120.00',
    });
  });

  it('is one price for a single variant, and none without variants', () => {
    expect(channelPriceRange([variant('12.00')])).toEqual({ min: '12.00', max: '12.00' });
    expect(channelPriceRange([])).toBeNull();
  });
});
