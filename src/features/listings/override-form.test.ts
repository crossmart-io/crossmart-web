import { ListingVisibility } from '@/api/schema';
import { FOLLOW_PRODUCT } from './listings.constants';
import { isEmptyPatch, productDefaultsOf, toOverrideForm, toOverridePatch } from './override-form';
import {
  listingEditorFixture,
  listingEditorVariantFixture,
  overridden,
} from './testing/listing.fixture';

const LISTING = listingEditorFixture();

describe('override form', () => {
  it('starts empty where the store follows the product, with its values ready to edit', () => {
    expect(toOverrideForm(LISTING)).toEqual({
      title: '',
      vendor: '',
      customDescription: false,
      descriptionHtml: '<p>Soft washed linen.</p>',
      customTags: false,
      tags: ['linen', 'summer'],
      customMedia: false,
      mediaUrls: ['https://cdn.example.com/a.jpg'],
      visibility: FOLLOW_PRODUCT,
      inventoryBuffer: '',
      maxQuantity: '',
      prices: [{ variantId: 'v-1', price: '', compareAtPrice: '' }],
    });
  });

  it('holds the store’s own values where it overrides them', () => {
    const form = toOverrideForm(
      listingEditorFixture({
        title: overridden('Linen shirt', 'Shop shirt'),
        tags: overridden(['linen'], []),
        visibility: overridden(ListingVisibility.VISIBLE, ListingVisibility.HIDDEN),
        stock: { inventoryBuffer: 2, maxQuantity: null },
        variants: [
          listingEditorVariantFixture({
            price: { product: '64.00', override: '59.00', effective: '59.00', overridden: true },
          }),
        ],
      }),
    );

    expect(form).toMatchObject({
      title: 'Shop shirt',
      customTags: true,
      tags: [],
      visibility: ListingVisibility.HIDDEN,
      inventoryBuffer: '2',
      prices: [{ variantId: 'v-1', price: '59.00', compareAtPrice: '' }],
    });
  });

  it('reads the product’s own values for going back to them', () => {
    expect(productDefaultsOf(LISTING)).toEqual({
      descriptionHtml: '<p>Soft washed linen.</p>',
      tags: ['linen', 'summer'],
      mediaUrls: ['https://cdn.example.com/a.jpg'],
    });
  });
});

describe('override patch', () => {
  const saved = toOverrideForm(LISTING);

  it('sends nothing when nothing changed', () => {
    expect(isEmptyPatch(toOverridePatch(saved, saved))).toBe(true);
  });

  it('sends only the fields that changed, leaving every other override as it is', () => {
    const patch = toOverridePatch(saved, {
      ...saved,
      title: ' Shop shirt ',
      inventoryBuffer: '2',
    });

    expect(patch).toEqual({ title: 'Shop shirt', inventoryBuffer: 2 });
  });

  it('sends null for a field brought back to the product’s value', () => {
    const withTitle = { ...saved, title: 'Shop shirt', customTags: true, tags: ['shop'] };

    expect(toOverridePatch(withTitle, { ...withTitle, title: '' })).toEqual({ title: null });
    expect(toOverridePatch(withTitle, { ...withTitle, customTags: false })).toEqual({
      tags: null,
    });
  });

  it('sends only the variants whose prices changed, both null to follow the rule again', () => {
    const twoVariants = toOverrideForm(
      listingEditorFixture({
        variants: [
          listingEditorVariantFixture({
            price: { product: '64.00', override: '59.00', effective: '59.00', overridden: true },
          }),
          listingEditorVariantFixture({ variantId: 'v-2', title: 'Red' }),
        ],
      }),
    );

    const patch = toOverridePatch(twoVariants, {
      ...twoVariants,
      prices: [
        { variantId: 'v-1', price: '', compareAtPrice: '' },
        { variantId: 'v-2', price: '', compareAtPrice: ' 90 ' },
      ],
    });

    expect(patch).toEqual({
      variantPrices: [
        { variantId: 'v-1', price: null, compareAtPrice: null },
        { variantId: 'v-2', price: null, compareAtPrice: '90' },
      ],
    });
  });

  it('sends a trimmed vendor for the store, and null once it follows the product', () => {
    const withVendor = { ...saved, vendor: ' Shop brand ' };

    expect(toOverridePatch(saved, withVendor)).toEqual({ vendor: 'Shop brand' });
    expect(toOverridePatch(withVendor, saved)).toEqual({ vendor: null });
  });

  it('holds the store’s vendor where it overrides it', () => {
    const form = toOverrideForm(
      listingEditorFixture({ vendor: overridden<string | null>('Northfield', 'Shop brand') }),
    );

    expect(form.vendor).toBe('Shop brand');
  });

  it('sends a description written for the store, and null once it follows the product', () => {
    const custom = { ...saved, customDescription: true, descriptionHtml: '<p>Shop</p>' };

    expect(toOverridePatch(saved, custom)).toEqual({ descriptionHtml: '<p>Shop</p>' });
    expect(toOverridePatch(custom, saved)).toEqual({ descriptionHtml: null });
  });
});
