import { useFormContext } from 'react-hook-form';
import { FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useListingField } from '../../hooks/useListingField';
import { ListingField } from '../../listing-editor';
import { LISTING_FIELD_LABELS } from '../../listings.constants';
import type { OverrideFormValues } from '../../override-form';
import { InheritedField } from './InheritedField';
import { useListingEditorContext } from './listing-editor-context';

/** The single-line text fields a store can change, and the form value each one edits. */
const TEXT_FIELD_VALUES = {
  [ListingField.Title]: 'title',
  [ListingField.Vendor]: 'vendor',
} as const satisfies Partial<Record<ListingField, keyof OverrideFormValues>>;

export type TextListingField = keyof typeof TEXT_FIELD_VALUES;

interface InheritedTextFieldProps {
  field: TextListingField;
  /** The product's value, which an empty input shows and follows; null when it has none. */
  productValue: string | null;
  /** What to call the product's value when it has none, beside a changed field. */
  emptyProductValue?: string;
}

/** A single-line text field in this store: empty shows, and follows, the product's value. */
export function InheritedTextField({
  field,
  productValue,
  emptyProductValue,
}: InheritedTextFieldProps) {
  const { productDefaults, readOnly } = useListingEditorContext();
  const { register } = useFormContext<OverrideFormValues>();
  const { origin, useProductValue } = useListingField(field, productDefaults);
  const label = LISTING_FIELD_LABELS[field];
  const inputId = `listing-${field}`;
  return (
    <InheritedField
      name={label}
      label={<FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      origin={origin}
      productValue={productValue ?? emptyProductValue}
      onUseProductValue={readOnly ? undefined : useProductValue}
    >
      <Input
        id={inputId}
        dir="auto"
        placeholder={productValue ?? ''}
        {...register(TEXT_FIELD_VALUES[field])}
      />
    </InheritedField>
  );
}
