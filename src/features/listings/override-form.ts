import { z } from 'zod';
import {
  FOLLOW_PRODUCT,
  OVERRIDE_TITLE_MAX_LENGTH,
  type VisibilityChoice,
} from './listings.constants';
import type { ListingOverride, ListingOverrideView, ProductChannel } from './listings.types';
import { type components, ListingVisibility } from '@/api/schema';
import { optionalCount, optionalMoneyAmount } from '@/lib/form-schemas';

type Product = components['schemas']['ProductDto'];

export const overrideFormSchema = z.object({
  title: z.string().trim().max(OVERRIDE_TITLE_MAX_LENGTH),
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
      /** Not editable here; carried through so saving keeps one set through the API or MCP. */
      compareAtPrice: z.string().nullable(),
    }),
  ),
});

export type OverrideFormValues = z.infer<typeof overrideFormSchema>;

/** What the product says where the listing does not override it; only its images' URLs matter. */
export type ProductDefaults = Pick<Product, 'descriptionHtml' | 'tags'> & {
  media: Pick<Product['media'][number], 'url'>[];
};

function countText(value: number | null | undefined): string {
  return value === null || value === undefined ? '' : String(value);
}

function toPriceFields(channel: ProductChannel): OverrideFormValues['prices'] {
  const overrides = new Map(
    (channel.override?.variantPrices ?? []).map((entry) => [entry.variantId, entry]),
  );
  return channel.variants.map((variant) => {
    const override = overrides.get(variant.variantId);
    return {
      variantId: variant.variantId,
      price: override?.price ?? '',
      compareAtPrice: override?.compareAtPrice ?? null,
    };
  });
}

function toDescriptionFields(
  override: ListingOverrideView | null,
  product: ProductDefaults,
): Pick<OverrideFormValues, 'customDescription' | 'descriptionHtml'> {
  const custom = override?.descriptionHtml ?? null;
  return {
    customDescription: custom !== null,
    descriptionHtml: custom ?? product.descriptionHtml,
  };
}

/** Tags and images: the store's own once overridden, the product's to start from otherwise. */
function toTagAndMediaFields(
  override: ListingOverrideView | null,
  product: ProductDefaults,
): Pick<OverrideFormValues, 'customTags' | 'tags' | 'customMedia' | 'mediaUrls'> {
  return {
    customTags: (override?.tags ?? null) !== null,
    tags: override?.tags ?? product.tags,
    customMedia: (override?.mediaUrls ?? null) !== null,
    mediaUrls: override?.mediaUrls ?? product.media.map(({ url }) => url),
  };
}

export function toOverrideForm(
  channel: ProductChannel,
  product: ProductDefaults,
): OverrideFormValues {
  const override = channel.override ?? null;
  return {
    title: override?.title ?? '',
    ...toDescriptionFields(override, product),
    ...toTagAndMediaFields(override, product),
    visibility: (override?.visibility ?? FOLLOW_PRODUCT) as VisibilityChoice,
    inventoryBuffer: countText(override?.inventoryBuffer),
    maxQuantity: countText(override?.maxQuantity),
    prices: toPriceFields(channel),
  };
}

function toCount(value: string): number | null {
  return value.trim() === '' ? null : Number.parseInt(value, 10);
}

/** The override body. Unticked tags and images follow the product again. */
export function toOverrideBody(values: OverrideFormValues): ListingOverride {
  return {
    title: values.title.trim() || null,
    descriptionHtml: values.customDescription ? values.descriptionHtml : null,
    tags: values.customTags ? values.tags : null,
    mediaUrls: values.customMedia ? values.mediaUrls : null,
    visibility: values.visibility === FOLLOW_PRODUCT ? null : values.visibility,
    inventoryBuffer: toCount(values.inventoryBuffer),
    maxQuantity: toCount(values.maxQuantity),
    variantPrices: toVariantPrices(values.prices),
  };
}

/** Variants that override their price, their compare-at price, or both. */
function toVariantPrices(prices: OverrideFormValues['prices']): ListingOverride['variantPrices'] {
  return prices
    .map((entry) => ({
      variantId: entry.variantId,
      price: entry.price.trim() || null,
      compareAtPrice: entry.compareAtPrice,
    }))
    .filter((entry) => entry.price !== null || entry.compareAtPrice !== null);
}
