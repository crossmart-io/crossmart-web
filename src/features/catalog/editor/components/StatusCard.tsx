import { Controller, useFormContext } from 'react-hook-form';
import { ProductStatus } from '@/api/schema';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isEnumValue } from '@/lib/enum';
import { PRODUCT_STATUS_LABELS } from '../../product-status';
import type { ProductFormValues } from '../product-form.schema';
import { EditorCard } from './EditorCard';

const STATUS_FIELD_ID = 'status';

const STATUS_HINTS: Record<ProductStatus, string> = {
  [ProductStatus.ACTIVE]: 'Ready to list in your stores.',
  [ProductStatus.DRAFT]: 'Hidden from your stores while you work on it.',
  [ProductStatus.ARCHIVED]: 'Kept for your records and removed from your stores.',
};

export function StatusCard() {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <EditorCard title="Status">
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor={STATUS_FIELD_ID} className="sr-only">
              Status
            </FieldLabel>
            <Select
              value={field.value}
              onValueChange={(value) => isEnumValue(ProductStatus, value) && field.onChange(value)}
            >
              <SelectTrigger id={STATUS_FIELD_ID} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(ProductStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {PRODUCT_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>{STATUS_HINTS[field.value]}</FieldDescription>
          </Field>
        )}
      />
    </EditorCard>
  );
}
