import { PriceSource } from '@/api/schema';
import { LISTING_EDITOR_COPY, LISTING_FIELD_LABELS } from '@/features/listings/listings.constants';
import type { ChannelVariant, ProductChannel } from '@/features/listings/listings.types';

type ListingOverrideView = NonNullable<ProductChannel['override']>;

/** The units the store shows across the variants that track stock; null when none does. */
export function channelStock(variants: readonly ChannelVariant[]): number | null {
  const tracked = variants.filter((variant) => variant.quantity !== null);
  if (tracked.length === 0) return null;
  return tracked.reduce((total, variant) => total + (variant.quantity ?? 0), 0);
}

/** Whether the store sells a variant at a price set for it, instead of the rule's. */
export function hasPriceOverride(variants: readonly ChannelVariant[]): boolean {
  return variants.some((variant) => variant.price.source === PriceSource.override);
}

/** The override's fields that differ from the product, by the name the listing editor uses. */
function overriddenFieldLabels(override: ListingOverrideView): string[] {
  const changed: [boolean, string][] = [
    [override.title !== null, LISTING_FIELD_LABELS.title],
    [override.vendor !== null, LISTING_FIELD_LABELS.vendor],
    [override.descriptionHtml !== null, LISTING_FIELD_LABELS.description],
    [override.tags !== null, LISTING_FIELD_LABELS.tags],
    [override.mediaUrls !== null, LISTING_FIELD_LABELS.images],
    [override.visibility !== null, LISTING_FIELD_LABELS.visibility],
    [
      override.inventoryBuffer !== null || override.maxQuantity !== null,
      LISTING_FIELD_LABELS.stock,
    ],
  ];
  return changed.filter(([isChanged]) => isChanged).map(([, label]) => label);
}

/** What the store changes for this product, in words: fields first, then variant prices. */
export function overrideSummary(override: ProductChannel['override']): string[] {
  if (!override) return [];
  const names = overriddenFieldLabels(override);
  const priced = override.variantPrices.filter((entry) => entry.price !== null).length;
  if (priced > 0) names.push(LISTING_EDITOR_COPY.pricedVariants(priced));
  return names;
}
