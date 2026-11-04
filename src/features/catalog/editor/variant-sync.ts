import { OutOfStockPolicy } from '@/api/schema';
import type { OptionFormValues, VariantFormValues } from './product-form.schema';

export function emptyVariant(): VariantFormValues {
  return {
    optionValues: [],
    sku: '',
    barcode: '',
    price: '',
    compareAtPrice: '',
    weightGrams: '',
    requiresShipping: true,
    taxable: true,
    outOfStockPolicy: OutOfStockPolicy.STOP_SELLING,
    tracked: true,
    quantity: '0',
  };
}

/** Every combination of option values, in option order. No options means one empty combination. */
export function combinations(options: OptionFormValues[]): string[][] {
  return options.reduce<string[][]>(
    (combos, option) => combos.flatMap((combo) => option.values.map((value) => [...combo, value])),
    [[]],
  );
}

const normalize = (value: string): string => value.trim().toLowerCase();

/** True when every value of `shorter` appears in `longer`, in the same order. */
function isSubsequence(shorter: string[], longer: string[]): boolean {
  let cursor = 0;
  for (const value of longer) {
    if (cursor < shorter.length && normalize(value) === normalize(shorter[cursor] ?? '')) {
      cursor += 1;
    }
  }
  return cursor === shorter.length;
}

function sameValues(left: string[], right: string[]): boolean {
  return left.length === right.length && isSubsequence(left, right);
}

/** Pricing and shipping defaults for a new variant, copied from an existing one. */
function newVariantLike(template: VariantFormValues, optionValues: string[]): VariantFormValues {
  return {
    ...emptyVariant(),
    price: template.price,
    compareAtPrice: template.compareAtPrice,
    weightGrams: template.weightGrams,
    requiresShipping: template.requiresShipping,
    taxable: template.taxable,
    outOfStockPolicy: template.outOfStockPolicy,
    tracked: template.tracked,
    optionValues,
  };
}

/**
 * The variant rows for a new set of options. Existing variants keep their id, SKU, price and
 * stock: first by exact option values, then when an option was added or removed (one set of
 * values contains the other). Each existing variant is reused at most once.
 */
export function syncVariants(
  options: OptionFormValues[],
  current: VariantFormValues[],
): VariantFormValues[] {
  const unused = [...current];
  const template = current[0] ?? emptyVariant();
  const take = (predicate: (variant: VariantFormValues) => boolean) => {
    const index = unused.findIndex(predicate);
    return index === -1 ? undefined : unused.splice(index, 1)[0];
  };

  const combos = combinations(options);
  const exact = combos.map((combo) => take((variant) => sameValues(variant.optionValues, combo)));
  return combos.map((combo, index) => {
    const match =
      exact[index] ??
      take(
        (variant) =>
          isSubsequence(variant.optionValues, combo) || isSubsequence(combo, variant.optionValues),
      );
    return match ? { ...match, optionValues: combo } : newVariantLike(template, combo);
  });
}
