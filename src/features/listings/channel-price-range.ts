import type { ChannelVariant } from './listings.types';

export interface PriceRange {
  min: string;
  max: string;
}

/** The lowest and highest price a store shows for the product, or null with no variants. */
export function channelPriceRange(variants: readonly ChannelVariant[]): PriceRange | null {
  if (variants.length === 0) return null;
  const sorted = variants
    .map((variant) => variant.price.price)
    .sort((left, right) => Number(left) - Number(right));
  return { min: sorted[0] ?? '', max: sorted[sorted.length - 1] ?? '' };
}
