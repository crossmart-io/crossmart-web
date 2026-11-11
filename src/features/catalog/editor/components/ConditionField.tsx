import { Controller, useFormContext } from 'react-hook-form';
import { ProductCondition } from '@/api/schema';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { parseEnum } from '@/lib/enum';
import {
  CONDITION_NOT_SET,
  CONDITION_NOT_SET_LABEL,
  PRODUCT_CONDITION_LABELS,
} from '../../product-condition';
import type { ProductFormValues } from '../product-form.schema';

const CONDITION_FIELD_ID = 'condition';

/** The item's condition, or none: each store then lists it in its own default condition. */
export function ConditionField() {
  const { control } = useFormContext<ProductFormValues>();
  return (
    <Controller
      control={control}
      name="condition"
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor={CONDITION_FIELD_ID}>Condition</FieldLabel>
          <Select
            value={field.value ?? CONDITION_NOT_SET}
            onValueChange={(value) => field.onChange(parseEnum(ProductCondition, value) ?? null)}
            disabled={field.disabled}
          >
            <SelectTrigger id={CONDITION_FIELD_ID} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={CONDITION_NOT_SET}>{CONDITION_NOT_SET_LABEL}</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                {Object.values(ProductCondition).map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {PRODUCT_CONDITION_LABELS[condition]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}
