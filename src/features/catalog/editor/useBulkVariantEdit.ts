import { type FieldPath, useFormContext } from 'react-hook-form';
import type { ProductFormValues } from './product-form.schema';
import type { BulkVariantField } from './variants.constants';

function variantFieldPath(index: number, field: BulkVariantField): FieldPath<ProductFormValues> {
  return `variants.${index}.${field}`;
}

/**
 * Sets one field of many variants through the form, so the change is dirty and validated like
 * any edit, and nothing is saved until the product is.
 */
export function useBulkVariantEdit() {
  const { setValue, trigger, formState } = useFormContext<ProductFormValues>();
  const { isSubmitted } = formState;

  return (indices: number[], field: BulkVariantField, value: string) => {
    const paths = indices.map((index) => variantFieldPath(index, field));
    for (const path of paths) setValue(path, value, { shouldDirty: true, shouldTouch: true });
    // Once a save was tried, errors show; re-check the edited fields in one pass.
    if (isSubmitted) void trigger(paths);
  };
}
