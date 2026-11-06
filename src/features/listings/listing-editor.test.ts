import { ListingVisibility } from '@/api/schema';
import {
  FieldOrigin,
  fieldOrigin,
  hasListingChanges,
  ListingField,
  listingChanges,
  productValuePatch,
  VariantPriceField,
  variantPriceOrigin,
} from './listing-editor';
import { FOLLOW_PRODUCT } from './listings.constants';
import { type OverrideFormValues, toOverrideForm } from './override-form';
import { overrideFixture, productChannelFixture, productFixture } from './testing/listing.fixture';

const PRODUCT = productFixture();

function formFor(override = overrideFixture()): OverrideFormValues {
  return toOverrideForm(productChannelFixture({ override }), PRODUCT);
}

describe('listing editor fields', () => {
  it('follows the product everywhere while the store changes nothing', () => {
    const values = formFor();

    for (const field of Object.values(ListingField)) {
      expect(fieldOrigin(values, field)).toBe(FieldOrigin.Product);
    }
    expect(hasListingChanges(listingChanges(values))).toBe(false);
  });

  it('marks each field the store changes', () => {
    const values = formFor(
      overrideFixture({
        title: 'Shop title',
        descriptionHtml: '<p>Shop</p>',
        tags: [],
        mediaUrls: ['https://cdn.example.com/a.jpg'],
        visibility: ListingVisibility.HIDDEN,
        maxQuantity: 3,
      }),
    );

    for (const field of Object.values(ListingField)) {
      expect(fieldOrigin(values, field)).toBe(FieldOrigin.Store);
    }
  });

  it('treats a blank title as following the product', () => {
    expect(fieldOrigin({ ...formFor(), title: '   ' }, ListingField.Title)).toBe(
      FieldOrigin.Product,
    );
  });

  it('marks a variant’s price and compare-at price apart', () => {
    const entry = { variantId: 'v-1', price: '', compareAtPrice: '70.00' };

    expect(variantPriceOrigin(entry, VariantPriceField.Price)).toBe(FieldOrigin.Product);
    expect(variantPriceOrigin(entry, VariantPriceField.CompareAtPrice)).toBe(FieldOrigin.Store);
  });

  it('brings back the product’s value for each field', () => {
    expect(productValuePatch(ListingField.Title, PRODUCT)).toEqual({ title: '' });
    expect(productValuePatch(ListingField.Description, PRODUCT)).toEqual({
      customDescription: false,
      descriptionHtml: PRODUCT.descriptionHtml,
    });
    expect(productValuePatch(ListingField.Tags, PRODUCT)).toEqual({
      customTags: false,
      tags: PRODUCT.tags,
    });
    expect(productValuePatch(ListingField.Images, PRODUCT)).toEqual({
      customMedia: false,
      mediaUrls: ['https://cdn.example.com/a.jpg'],
    });
    expect(productValuePatch(ListingField.Visibility, PRODUCT)).toEqual({
      visibility: FOLLOW_PRODUCT,
    });
    expect(productValuePatch(ListingField.Stock, PRODUCT)).toEqual({
      inventoryBuffer: '',
      maxQuantity: '',
    });
  });

  it('sums up the changed fields and how many variants have their own prices', () => {
    const values = formFor(
      overrideFixture({
        title: 'Shop title',
        variantPrices: [{ variantId: 'v-1', price: '59.00', compareAtPrice: null }],
      }),
    );

    expect(listingChanges(values)).toEqual({ fields: [ListingField.Title], pricedVariants: 1 });
  });
});
