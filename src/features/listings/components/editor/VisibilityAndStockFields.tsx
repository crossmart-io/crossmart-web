import { useFormContext } from 'react-hook-form';
import { EnumSelectField } from '@/components/forms/EnumSelectField';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useListingField } from '../../hooks/useListingField';
import { ListingField } from '../../listing-editor';
import {
  LISTING_FIELD_LABELS,
  STOCK_FIELD_COPY,
  VISIBILITY_OPTIONS,
} from '../../listings.constants';
import type { OverrideFormValues } from '../../override-form';
import { InheritedField } from './InheritedField';
import { useListingEditorContext } from './listing-editor-context';

const VISIBILITY_INPUT_ID = 'listing-visibility';

/** Whether the store shows the product: as its status says, or shown or hidden here. */
export function VisibilityField() {
  const { product, readOnly } = useListingEditorContext();
  const { control } = useFormContext<OverrideFormValues>();
  const { origin, useProductValue } = useListingField(ListingField.Visibility, product);
  return (
    <InheritedField
      name={LISTING_FIELD_LABELS.visibility}
      label={
        <FieldLabel htmlFor={VISIBILITY_INPUT_ID}>{LISTING_FIELD_LABELS.visibility}</FieldLabel>
      }
      origin={origin}
      onUseProductValue={readOnly ? undefined : useProductValue}
    >
      <EnumSelectField
        control={control}
        name="visibility"
        id={VISIBILITY_INPUT_ID}
        options={VISIBILITY_OPTIONS}
      />
    </InheritedField>
  );
}

function CountInput({
  name,
  label,
  placeholder,
  description,
}: {
  name: 'inventoryBuffer' | 'maxQuantity';
  label: string;
  placeholder: string;
  description?: string;
}) {
  const { register, getFieldState, formState } = useFormContext<OverrideFormValues>();
  const { error } = getFieldState(name, formState);
  const id = `listing-${name}`;
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id} className="text-xs font-normal text-muted-foreground">
        {label}
      </FieldLabel>
      <Input id={id} inputMode="numeric" placeholder={placeholder} {...register(name)} />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={[error]} />
    </Field>
  );
}

/** How much of the product's stock this store sees: all of it unless units are held back. */
export function StockField() {
  const { product, readOnly } = useListingEditorContext();
  const { origin, useProductValue } = useListingField(ListingField.Stock, product);
  return (
    <InheritedField
      name={LISTING_FIELD_LABELS.stock}
      label={<span className="text-sm font-medium">{LISTING_FIELD_LABELS.stock}</span>}
      origin={origin}
      productValue={STOCK_FIELD_COPY.productValue}
      onUseProductValue={readOnly ? undefined : useProductValue}
    >
      <div className="grid grid-cols-2 gap-3">
        <CountInput
          name="inventoryBuffer"
          label={STOCK_FIELD_COPY.holdBack}
          placeholder={STOCK_FIELD_COPY.noneHeld}
          description={STOCK_FIELD_COPY.holdBackHint}
        />
        <CountInput
          name="maxQuantity"
          label={STOCK_FIELD_COPY.max}
          placeholder={STOCK_FIELD_COPY.noLimit}
        />
      </div>
    </InheritedField>
  );
}
