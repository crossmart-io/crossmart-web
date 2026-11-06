import { type PathValue, type UseFormSetValue, useFormContext, useWatch } from 'react-hook-form';
import {
  type FieldOrigin,
  fieldOrigin,
  type ListingField,
  productValuePatch,
} from '../listing-editor';
import type { OverrideFormValues, ProductDefaults } from '../override-form';

/** Options that make a value written by code count as the merchant's edit. */
export const FORM_EDIT = { shouldDirty: true, shouldValidate: true } as const;

type FormField = keyof OverrideFormValues;

/** Writes each value of `patch` into the form, as if the merchant had typed it. */
export function applyFormPatch(
  setValue: UseFormSetValue<OverrideFormValues>,
  patch: Partial<OverrideFormValues>,
): void {
  for (const name of Object.keys(patch) as FormField[]) {
    setField(setValue, name, patch);
  }
}

function setField<Name extends FormField>(
  setValue: UseFormSetValue<OverrideFormValues>,
  name: Name,
  patch: Partial<OverrideFormValues>,
): void {
  const value = patch[name];
  // A top-level key is its own path, so its value is the path's value; TypeScript cannot see that
  // for a generic key.
  if (value !== undefined) setValue(name, value as PathValue<OverrideFormValues, Name>, FORM_EDIT);
}

export interface ListingFieldState {
  origin: FieldOrigin;
  /** Makes the field follow the product again; saved with the rest of the form. */
  useProductValue: () => void;
}

/** Where one field of the listing gets its value now, and the way back to the product's. */
export function useListingField(field: ListingField, product: ProductDefaults): ListingFieldState {
  const { control, setValue } = useFormContext<OverrideFormValues>();
  const values = useWatch({ control }) as OverrideFormValues;
  return {
    origin: fieldOrigin(values, field),
    useProductValue: () => applyFormPatch(setValue, productValuePatch(field, product)),
  };
}
