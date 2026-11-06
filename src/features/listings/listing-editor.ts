import { FOLLOW_PRODUCT } from './listings.constants';
import type { OverrideFormValues, ProductDefaults } from './override-form';

/** Where a field of a listing gets its value: the product, or a change made for this store. */
export enum FieldOrigin {
  Product = 'product',
  Store = 'store',
}

/** The listing's fields a store can change as a whole; prices are per variant. */
export enum ListingField {
  Title = 'title',
  Description = 'description',
  Tags = 'tags',
  Images = 'images',
  Visibility = 'visibility',
  Stock = 'stock',
}

/** In the order the editor shows them. */
export const LISTING_FIELDS: readonly ListingField[] = [
  ListingField.Title,
  ListingField.Description,
  ListingField.Tags,
  ListingField.Images,
  ListingField.Visibility,
  ListingField.Stock,
];

/** A variant's two prices a store can change. */
export enum VariantPriceField {
  Price = 'price',
  CompareAtPrice = 'compareAtPrice',
}

type VariantPrice = OverrideFormValues['prices'][number];

/** Whether the store changes this field, as the form holds it now. */
export function fieldOrigin(values: OverrideFormValues, field: ListingField): FieldOrigin {
  return isFieldChanged(values, field) ? FieldOrigin.Store : FieldOrigin.Product;
}

function isFieldChanged(values: OverrideFormValues, field: ListingField): boolean {
  switch (field) {
    case ListingField.Title:
      return values.title.trim() !== '';
    case ListingField.Description:
      return values.customDescription;
    case ListingField.Tags:
      return values.customTags;
    case ListingField.Images:
      return values.customMedia;
    case ListingField.Visibility:
      return values.visibility !== FOLLOW_PRODUCT;
    case ListingField.Stock:
      return values.inventoryBuffer.trim() !== '' || values.maxQuantity.trim() !== '';
  }
}

/** Whether the store sets this variant's price, or its compare-at price, itself. */
export function variantPriceOrigin(entry: VariantPrice, field: VariantPriceField): FieldOrigin {
  return entry[field].trim() === '' ? FieldOrigin.Product : FieldOrigin.Store;
}

/** The form's values that make a field follow the product again. */
export function productValuePatch(
  field: ListingField,
  product: ProductDefaults,
): Partial<OverrideFormValues> {
  switch (field) {
    case ListingField.Title:
      return { title: '' };
    case ListingField.Description:
      return { customDescription: false, descriptionHtml: product.descriptionHtml };
    case ListingField.Tags:
      return { customTags: false, tags: product.tags };
    case ListingField.Images:
      return { customMedia: false, mediaUrls: product.mediaUrls };
    case ListingField.Visibility:
      return { visibility: FOLLOW_PRODUCT };
    case ListingField.Stock:
      return { inventoryBuffer: '', maxQuantity: '' };
  }
}

/** What the store changes, as the form holds it now: whole fields, and how many variants' prices. */
export interface ListingChanges {
  fields: ListingField[];
  /** Variants with a price or compare-at price of their own here. */
  pricedVariants: number;
}

export function listingChanges(values: OverrideFormValues): ListingChanges {
  return {
    fields: LISTING_FIELDS.filter((field) => isFieldChanged(values, field)),
    pricedVariants: values.prices.filter(
      (entry) =>
        variantPriceOrigin(entry, VariantPriceField.Price) === FieldOrigin.Store ||
        variantPriceOrigin(entry, VariantPriceField.CompareAtPrice) === FieldOrigin.Store,
    ).length,
  };
}

export function hasListingChanges(changes: ListingChanges): boolean {
  return changes.fields.length > 0 || changes.pricedVariants > 0;
}
