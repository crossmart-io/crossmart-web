import { useFormContext, useWatch } from 'react-hook-form';
import type { ProductFormValues } from '../product-form.schema';
import { EditorCard } from './EditorCard';
import { CheckboxField, TextField } from './FormFields';

/** Shipping details of a product without options. */
export function ShippingCard() {
  const { control } = useFormContext<ProductFormValues>();
  const requiresShipping = useWatch({ control, name: 'variants.0.requiresShipping' });

  return (
    <EditorCard title="Shipping">
      <CheckboxField name="variants.0.requiresShipping" label="This is a physical product" />
      {requiresShipping && (
        <div className="sm:w-1/2">
          <TextField
            name="variants.0.weightGrams"
            label="Weight (g)"
            inputMode="numeric"
            description="Used for shipping rates on marketplaces."
          />
        </div>
      )}
    </EditorCard>
  );
}
