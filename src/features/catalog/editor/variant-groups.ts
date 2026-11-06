import type { VariantFormValues } from './product-form.schema';
import {
  MAX_UNGROUPED_VARIANTS,
  MIN_FILTERABLE_VARIANTS,
  MIN_OPTIONS_TO_GROUP,
} from './variants.constants';

const VARIANT_LABEL_SEPARATOR = ' / ';
const WHITESPACE = /\s+/;
const WHOLE_NUMBER = /^-?\d+$/;

/** The fields of a variant that the grid's grouping and filter read. */
export type VariantSummaryFields = Pick<VariantFormValues, 'optionValues' | 'price' | 'quantity'>;

export interface PriceRange {
  min: string;
  max: string;
}

/** Variants that share a value of the first option, e.g. every "Red" variant. */
export interface VariantGroupSummary {
  /** The first option's value, which names the group. */
  value: string;
  /** Positions in the form's `variants` array, in their original order. */
  indices: number[];
  /** Lowest and highest valid price, or null when no price is set yet. */
  priceRange: PriceRange | null;
  totalStock: number;
}

/** What the grid shows: one flat list or groups, narrowed by the filter. */
export interface VariantGridView {
  grouped: boolean;
  filterable: boolean;
  /** Positions of the variants that match the filter. */
  visibleIndices: number[];
  /** Groups of the visible variants; empty when the grid is flat. */
  groups: VariantGroupSummary[];
}

export function variantLabel(optionValues: string[]): string {
  return optionValues.join(VARIANT_LABEL_SEPARATOR);
}

export function shouldGroupVariants(optionCount: number, variantCount: number): boolean {
  return optionCount >= MIN_OPTIONS_TO_GROUP && variantCount > MAX_UNGROUPED_VARIANTS;
}

export function isFilterable(variantCount: number): boolean {
  return variantCount >= MIN_FILTERABLE_VARIANTS;
}

/** True when every word of the query appears in the variant's option values, ignoring case. */
export function matchesVariantFilter(optionValues: string[], query: string): boolean {
  const words = query.trim().toLowerCase().split(WHITESPACE).filter(Boolean);
  const label = variantLabel(optionValues).toLowerCase();
  return words.every((word) => label.includes(word));
}

/** The lowest and highest of the prices that are valid amounts. */
export function priceRangeOf(prices: string[]): PriceRange | null {
  const valid = prices.filter((price) => price.trim() !== '' && Number.isFinite(Number(price)));
  if (valid.length === 0) return null;
  const sorted = [...valid].sort((left, right) => Number(left) - Number(right));
  return { min: sorted[0] ?? '', max: sorted[sorted.length - 1] ?? '' };
}

/** The sum of the quantities that are whole numbers; a half-typed one counts as none. */
export function totalStockOf(quantities: string[]): number {
  return quantities
    .map((quantity) => quantity.trim())
    .filter((quantity) => WHOLE_NUMBER.test(quantity))
    .reduce((total, quantity) => total + Number(quantity), 0);
}

/** Groups the given variants by their first option value, keeping the order values first appear. */
export function groupVariants(
  variants: VariantSummaryFields[],
  indices: number[],
): VariantGroupSummary[] {
  const byValue = new Map<string, number[]>();
  for (const index of indices) {
    const value = variants[index]?.optionValues[0] ?? '';
    const group = byValue.get(value);
    if (group) group.push(index);
    else byValue.set(value, [index]);
  }
  return [...byValue].map(([value, groupIndices]) => {
    const members = groupIndices.flatMap((index) => variants[index] ?? []);
    return {
      value,
      indices: groupIndices,
      priceRange: priceRangeOf(members.map((variant) => variant.price)),
      totalStock: totalStockOf(members.map((variant) => variant.quantity)),
    };
  });
}

/** Decides how the grid lays the variants out, and which of them the filter keeps. */
export function buildVariantGridView(
  variants: VariantSummaryFields[],
  optionCount: number,
  query: string,
): VariantGridView {
  const filterable = isFilterable(variants.length);
  const activeQuery = filterable ? query : '';
  const visibleIndices = variants.flatMap((variant, index) =>
    matchesVariantFilter(variant.optionValues, activeQuery) ? [index] : [],
  );
  const grouped = shouldGroupVariants(optionCount, variants.length);
  return {
    grouped,
    filterable,
    visibleIndices,
    groups: grouped ? groupVariants(variants, visibleIndices) : [],
  };
}
