import { ListingDisplayState, ListingVisibility, PriceSource } from '@/api/schema';
import { FOLLOW_PRODUCT } from './listings.constants';
import type { ChannelVariant, ProductChannel } from './listings.types';
import { toOverrideBody, toOverrideForm } from './override-form';

function variant(overrides: Partial<ChannelVariant> = {}): ChannelVariant {
  return {
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
      unitCost: null,
    },
    ...overrides,
  };
}

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
    displayState: ListingDisplayState.ready,
    displayReason: null,
    listing: null,
    override: null,
    variants: [variant()],
    ...overrides,
  };
}

const PRODUCT = {
  descriptionHtml: '<p>Hi</p>',
  tags: ['linen'],
  media: [{ url: 'https://cdn.example.com/a.jpg' }, { url: 'https://cdn.example.com/b.jpg' }],
};

describe('override form', () => {
  it('starts empty, following the product, with its description ready to edit', () => {
    const form = toOverrideForm(channel(), PRODUCT);

    expect(form).toMatchObject({
      title: '',
      customDescription: false,
      descriptionHtml: '<p>Hi</p>',
      visibility: FOLLOW_PRODUCT,
      prices: [{ variantId: 'v1', price: '', compareAtPrice: '' }],
      customTags: false,
      tags: ['linen'],
      customMedia: false,
      mediaUrls: ['https://cdn.example.com/a.jpg', 'https://cdn.example.com/b.jpg'],
    });
    expect(toOverrideBody(form)).toEqual({
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

  it('sends what the merchant set, with the store’s own tags and images', () => {
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
    const form = toOverrideForm(channel({ override: current }), PRODUCT);

    const body = toOverrideBody({
      ...form,
      title: ' Shopify title ',
      visibility: ListingVisibility.HIDDEN,
      inventoryBuffer: '2',
      prices: [{ variantId: 'v1', price: '9.50', compareAtPrice: '' }],
    });
    expect(form).toMatchObject({ customTags: true, tags: ['shopify'], customMedia: true });

    expect(body).toMatchObject({
      title: 'Shopify title',
      tags: ['shopify'],
      mediaUrls: ['https://cdn.example.com/a.jpg'],
      visibility: ListingVisibility.HIDDEN,
      inventoryBuffer: 2,
      variantPrices: [{ variantId: 'v1', price: '9.50', compareAtPrice: null }],
    });
  });

  it('follows the product again once tags or images are unticked', () => {
    const form = toOverrideForm(channel(), PRODUCT);

    expect(
      toOverrideBody({ ...form, customTags: true, tags: [], customMedia: false }),
    ).toMatchObject({ tags: [], mediaUrls: null });
  });

  it('sends a compare-at price set for this store, and drops one cleared again', () => {
    const form = toOverrideForm(channel(), PRODUCT);

    expect(
      toOverrideBody({ ...form, prices: [{ variantId: 'v1', price: '', compareAtPrice: ' 14 ' }] })
        .variantPrices,
    ).toEqual([{ variantId: 'v1', price: null, compareAtPrice: '14' }]);
    expect(
      toOverrideBody({ ...form, prices: [{ variantId: 'v1', price: '', compareAtPrice: '' }] })
        .variantPrices,
    ).toEqual([]);
  });

  it('keeps compare-at prices set through the API, even on variants with no price override', () => {
    const current = {
      title: null,
      descriptionHtml: null,
      tags: null,
      mediaUrls: null,
      visibility: null,
      inventoryBuffer: null,
      maxQuantity: null,
      variantPrices: [
        { variantId: 'v1', price: '9.00', compareAtPrice: '12.00' },
        { variantId: 'v2', price: null, compareAtPrice: '15.00' },
      ],
      updatedAt: '2026-11-03T09:00:00Z',
    };
    const twoVariants = channel({
      override: current,
      variants: [variant(), variant({ variantId: 'v2', title: 'Red' })],
    });

    const body = toOverrideBody(toOverrideForm(twoVariants, PRODUCT));

    expect(body.variantPrices).toEqual([
      { variantId: 'v1', price: '9.00', compareAtPrice: '12.00' },
      { variantId: 'v2', price: null, compareAtPrice: '15.00' },
    ]);
  });
});
