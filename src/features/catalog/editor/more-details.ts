import type { FieldErrors } from 'react-hook-form';
import { PageSection } from '@/config/routes';
import type { ProductFormValues, VariantFormValues } from './product-form.schema';

/** Fields of the only variant shown above More details, beside the photos and words. */
const ESSENTIAL_VARIANT_FIELDS: ReadonlySet<keyof VariantFormValues> = new Set([
  'price',
  'quantity',
]);

/** Product fields that live in More details. */
const MORE_DETAILS_FIELDS = ['vendor', 'productType', 'tags', 'options'] as const;

/** Sections inside More details that a link can scroll to, so it opens for them. */
const MORE_DETAILS_SECTIONS: readonly string[] = [PageSection.ProductVariants];

function hasVariantDetailError(errors: FieldErrors<ProductFormValues>): boolean {
  const variants = errors.variants;
  if (!Array.isArray(variants)) return false;
  return variants.some(
    (variant, index) =>
      variant !== undefined &&
      Object.keys(variant).some(
        (field) => index > 0 || !ESSENTIAL_VARIANT_FIELDS.has(field as keyof VariantFormValues),
      ),
  );
}

/** Whether a field in More details is invalid, so it opens to show it. */
export function hasMoreDetailsError(errors: FieldErrors<ProductFormValues>): boolean {
  return MORE_DETAILS_FIELDS.some((field) => errors[field]) || hasVariantDetailError(errors);
}

/** Whether a link (`#variants`) points into More details. */
export function linksIntoMoreDetails(hash: string): boolean {
  return MORE_DETAILS_SECTIONS.includes(hash.replace('#', ''));
}
