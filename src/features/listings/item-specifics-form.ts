import { BRAND_ASPECT } from './listings.constants';
import type { CategoryAspect, ItemSpecific } from './listings.types';

/** The values being edited, by aspect name. */
export type ItemSpecificValues = Record<string, string[]>;

/** eBay matches aspect names without regard to case. */
function sameName(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function filled(values: readonly string[] | undefined): string[] {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

/**
 * The form's starting values: the saved ones, with Brand prefilled from the vendor when the
 * category has a Brand aspect and none is saved.
 */
export function toItemSpecificValues(
  aspects: readonly CategoryAspect[],
  saved: readonly ItemSpecific[],
  vendor: string | null,
): ItemSpecificValues {
  const values: ItemSpecificValues = Object.fromEntries(
    saved.map((specific) => [specific.name, [...specific.values]]),
  );
  const brand = aspects.find((aspect) => sameName(aspect.name, BRAND_ASPECT));
  const brandSaved = saved.some((specific) => sameName(specific.name, BRAND_ASPECT));
  const vendorName = vendor?.trim();
  if (brand && !brandSaved && vendorName) values[brand.name] = [vendorName];
  return values;
}

/** What to save: every specific with at least one value, values trimmed. */
export function toItemSpecificsBody(values: ItemSpecificValues): ItemSpecific[] {
  return Object.entries(values)
    .map(([name, entries]) => ({ name, values: filled(entries) }))
    .filter((specific) => specific.values.length > 0);
}

/** Required aspects first; the rest go under "More specifics". */
export function groupAspects(aspects: readonly CategoryAspect[]): {
  required: CategoryAspect[];
  more: CategoryAspect[];
} {
  return {
    required: aspects.filter((aspect) => aspect.required),
    more: aspects.filter((aspect) => !aspect.required),
  };
}

/** The required aspects without a value yet. */
export function missingRequired(
  aspects: readonly CategoryAspect[],
  values: ItemSpecificValues,
): string[] {
  return aspects
    .filter((aspect) => aspect.required && filled(values[aspect.name]).length === 0)
    .map((aspect) => aspect.name);
}

/** Whether two sets of values would save the same item specifics. */
export function sameItemSpecifics(left: ItemSpecificValues, right: ItemSpecificValues): boolean {
  return JSON.stringify(toItemSpecificsBody(left)) === JSON.stringify(toItemSpecificsBody(right));
}
