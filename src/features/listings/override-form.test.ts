import { ListingVisibility, PriceSource } from '@/api/schema';
import { FOLLOW_PRODUCT } from './listings.constants';
import type { ProductChannel } from './listings.types';
import { toOverrideBody, toOverrideForm } from './override-form';

function channel(overrides: Partial<ProductChannel> = {}): ProductChannel {
  return {
    connection: {
      id: 'c',
      channel: 'shopify' as ProductChannel['connection']['channel'],
      displayName: 'Demo Store',
      status: 'CONNECTED' as ProductChannel['connection']['status'],
      currencyCode: 'USD',
    },
    selected: true,
    listing: null,
    override: null,
    variants: [
      {
        variantId: 'v1',
        title: 'Blue',
        quantity: 4,
        price: {
          price: '10.00',
          compareAtPrice: null,
          source: PriceSource.base,
          steps: [],
          explanation: 'base price = $10.00',
          warnings: [],
        },
      },
    ],
    ...overrides,
  };
}

describe('override form', () => {
  it('starts empty, following the product, with its description ready to edit', () => {
    const form = toOverrideForm(channel(), { descriptionHtml: '<p>Hi</p>' });

    expect(form).toMatchObject({
      title: '',
      customDescription: false,
      descriptionHtml: '<p>Hi</p>',
      visibility: FOLLOW_PRODUCT,
      prices: [{ variantId: 'v1', price: '' }],
    });
    expect(toOverrideBody(form, null)).toEqual({
      title: null,
      descriptionHtml: null,
      tags: null,
      mediaUrls: null,
      visibility: null,
      inventoryBuffer: null,
      maxQuantity: null,
      variantPrices: [],
    });
  });

  it('sends what the merchant set and keeps tags and images it does not edit', () => {
    const current = {
      title: 'Old',
      descriptionHtml: null,
      tags: ['shopify'],
      mediaUrls: ['https://cdn.example.com/a.jpg'],
      visibility: null,
      inventoryBuffer: null,
      maxQuantity: null,
      variantPrices: [],
      updatedAt: '2026-11-03T09:00:00Z',
    };
    const form = toOverrideForm(channel({ override: current }), { descriptionHtml: '' });

    const body = toOverrideBody(
      {
        ...form,
        title: ' Shopify title ',
        visibility: ListingVisibility.HIDDEN,
        inventoryBuffer: '2',
        prices: [{ variantId: 'v1', price: '9.50' }],
      },
      current,
    );

    expect(body).toMatchObject({
      title: 'Shopify title',
      tags: ['shopify'],
      mediaUrls: ['https://cdn.example.com/a.jpg'],
      visibility: ListingVisibility.HIDDEN,
      inventoryBuffer: 2,
      variantPrices: [{ variantId: 'v1', price: '9.50', compareAtPrice: null }],
    });
  });
});
