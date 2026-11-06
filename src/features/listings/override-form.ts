import { z } from 'zod';
import {
  FOLLOW_PRODUCT,
  OVERRIDE_TITLE_MAX_LENGTH,
  OVERRIDE_VENDOR_MAX_LENGTH,
  type VisibilityChoice,
} from './listings.constants';
import type { ListingEditor, ListingOverridePatch } from './listings.types';
import { ListingVisibility } from '@/api/schema';
import { optionalCount, optionalMoneyAmount } from '@/lib/form-schemas';

export const overrideFormSchema = z.object({
  title: z.string().trim().max(OVERRIDE_TITLE_MAX_LENGTH),
  vendor: z.string().trim().max(OVERRIDE_VENDOR_MAX_LENGTH),
  customDescription: z.boolean(),
  descriptionHtml: z.string(),
  customTags: z.boolean(),
  tags: z.array(z.string()),
  customMedia: z.boolean(),
  mediaUrls: z.array(z.string()),
  visibility: z.enum([FOLLOW_PRODUCT, ListingVisibility.VISIBLE, ListingVisibility.HIDDEN]),
  inventoryBuffer: optionalCount,
  maxQuantity: optionalCount,
  prices: z.array(
    z.object({
      variantId: z.string(),
      price: optionalMoneyAmount,
      compareAtPrice: optionalMoneyAmount,
    }),
  ),
});

export type OverrideFormValues = z.infer<typeof overrideFormSchema>;

/** The product's own values, which a field goes back to when it follows the product again. */
export interface ProductDefaults {
  descriptionHtml: string;
  tags: string[];
  mediaUrls: string[];
}

export function productDefaultsOf(listing: ListingEditor): ProductDefaults {
  return {
    descriptionHtml: listing.descriptionHtml.product,
    tags: listing.tags.product,
    mediaUrls: listing.images.product,
  };
}

function countText(value: number | null): string {
  return value === null ? '' : String(value);
}

/**
 * The form from the listing as the API reads it. Overridden fields hold the store's value;
 * the others hold the product's, ready to edit once the merchant changes them for the store.
 */
export function toOverrideForm(listing: ListingEditor): OverrideFormValues {
  return {
    title: listing.title.override ?? '',
    vendor: listing.vendor.override ?? '',
    customDescription: listing.descriptionHtml.overridden,
    descriptionHtml: listing.descriptionHtml.effective,
    customTags: listing.tags.overridden,
    tags: listing.tags.effective,
    customMedia: listing.images.overridden,
    mediaUrls: listing.images.effective,
    visibility: (listing.visibility.override ?? FOLLOW_PRODUCT) as VisibilityChoice,
    inventoryBuffer: countText(listing.stock.inventoryBuffer),
    maxQuantity: countText(listing.stock.maxQuantity),
    prices: listing.variants.map((variant) => ({
      variantId: variant.variantId,
      price: variant.price.override ?? '',
      compareAtPrice: variant.compareAtPrice.override ?? '',
    })),
  };
}

type OverrideFields = Required<Omit<ListingOverridePatch, 'variantPrices'>>;
type VariantPrice = NonNullable<ListingOverridePatch['variantPrices']>[number];

const OVERRIDE_FIELDS = [
  'title',
  'vendor',
  'descriptionHtml',
  'tags',
  'mediaUrls',
  'visibility',
  'inventoryBuffer',
  'maxQuantity',
] as const satisfies readonly (keyof OverrideFields)[];

function toCount(value: string): number | null {
  return value.trim() === '' ? null : Number.parseInt(value, 10);
}

/** What the form says the store overrides, field by field; null follows the product. */
function toOverrideFields(values: OverrideFormValues): OverrideFields {
  return {
    title: values.title.trim() || null,
    vendor: values.vendor.trim() || null,
    descriptionHtml: values.customDescription ? values.descriptionHtml : null,
    tags: values.customTags ? values.tags : null,
    mediaUrls: values.customMedia ? values.mediaUrls : null,
    visibility: values.visibility === FOLLOW_PRODUCT ? null : values.visibility,
    inventoryBuffer: toCount(values.inventoryBuffer),
    maxQuantity: toCount(values.maxQuantity),
  };
}

function toVariantPrice(entry: OverrideFormValues['prices'][number]): VariantPrice {
  return {
    variantId: entry.variantId,
    price: entry.price.trim() || null,
    compareAtPrice: entry.compareAtPrice.trim() || null,
  };
}

function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

/** The variants whose prices changed; both null reverts a variant to the pricing rule. */
function changedVariantPrices(
  saved: OverrideFormValues['prices'],
  current: OverrideFormValues['prices'],
): VariantPrice[] {
  return current.map(toVariantPrice).filter((entry, index) => {
    const before = saved[index];
    return !before || !sameValue(toVariantPrice(before), entry);
  });
}

/**
 * Only what changed since the last save, as a PATCH: an absent field keeps its override, null
 * makes it follow the product again, and variant prices merge per variant. Empty when nothing
 * changed.
 */
export function toOverridePatch(
  saved: OverrideFormValues,
  current: OverrideFormValues,
): ListingOverridePatch {
  const before = toOverrideFields(saved);
  const after = toOverrideFields(current);
  const fields = Object.fromEntries(
    OVERRIDE_FIELDS.filter((key) => !sameValue(before[key], after[key])).map((key) => [
      key,
      after[key],
    ]),
  ) as Partial<OverrideFields>;
  const variantPrices = changedVariantPrices(saved.prices, current.prices);
  return variantPrices.length > 0 ? { ...fields, variantPrices } : fields;
}

export function isEmptyPatch(patch: ListingOverridePatch): boolean {
  return Object.keys(patch).length === 0;
}
