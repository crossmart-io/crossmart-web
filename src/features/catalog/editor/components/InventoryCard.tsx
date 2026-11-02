import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { OutOfStockPolicy } from '@/api/schema';
import { Field, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import type { ProductFormValues } from '../product-form.schema';
import { EditorCard } from './EditorCard';
import { CheckboxField, TextField } from './FormFields';

const TRACKED_FIELD_ID = 'variants.0.tracked';
const CONTINUE_SELLING_FIELD_ID = 'variants.0.continueSelling';

/** SKU, barcode and stock of a product without options. */
export function InventoryCard() {
  const { control } = useFormContext<ProductFormValues>();
  const tracked = useWatch({ control, name: 'variants.0.tracked' });

  return (
    <EditorCard title="Inventory">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="variants.0.sku" label="SKU" isCode />
        <TextField
          name="variants.0.barcode"
          label="Barcode"
          description="GTIN, UPC, EAN or ISBN"
          isCode
        />
      </div>
      <Controller
        control={control}
        name="variants.0.tracked"
        render={({ field }) => (
          <Field orientation="horizontal">
            <Switch id={TRACKED_FIELD_ID} checked={field.value} onCheckedChange={field.onChange} />
            <FieldLabel htmlFor={TRACKED_FIELD_ID} className="font-normal">
              Track stock
            </FieldLabel>
          </Field>
        )}
      />
      {tracked && <StockFields />}
      <CheckboxField name="variants.0.taxable" label="Charge tax on this product" />
    </EditorCard>
  );
}

/** Stock level and what happens when it runs out, for a tracked product. */
function StockFields() {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <>
      <div className="sm:w-1/2">
        <TextField
          name="variants.0.quantity"
          label="Available"
          inputMode="numeric"
          description="Changes are recorded in the stock history."
        />
      </div>
      <Controller
        control={control}
        name="variants.0.outOfStockPolicy"
        render={({ field }) => (
          <Field orientation="horizontal">
            <Switch
              id={CONTINUE_SELLING_FIELD_ID}
              checked={field.value === OutOfStockPolicy.CONTINUE_SELLING}
              onCheckedChange={(checked) =>
                field.onChange(
                  checked ? OutOfStockPolicy.CONTINUE_SELLING : OutOfStockPolicy.STOP_SELLING,
                )
              }
            />
            <FieldLabel htmlFor={CONTINUE_SELLING_FIELD_ID} className="font-normal">
              Keep selling when out of stock
            </FieldLabel>
          </Field>
        )}
      />
    </>
  );
}
