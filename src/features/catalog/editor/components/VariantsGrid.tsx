import { useFieldArray, useFormContext } from 'react-hook-form';
import { MoneyInput } from '@/components/forms/MoneyInput';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ProductFormValues } from '../product-form.schema';

/** Price, SKU and stock of each variant, edited in place like a spreadsheet. */
export function VariantsGrid({ currency }: { currency: string }) {
  const { control, register, formState } = useFormContext<ProductFormValues>();
  const variants = useFieldArray({ control, name: 'variants', keyName: 'rowKey' });

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Variant</TableHead>
            <TableHead className="w-36">Price</TableHead>
            <TableHead className="w-40">SKU</TableHead>
            <TableHead className="w-28">Available</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.fields.map((variant, index) => {
            const errors = formState.errors.variants?.[index];
            const label = variant.optionValues.join(' / ');
            return (
              <TableRow key={variant.rowKey}>
                <TableCell className="font-medium">{label}</TableCell>
                <TableCell>
                  <MoneyInput
                    currency={currency}
                    aria-label={`Price of ${label}`}
                    aria-invalid={Boolean(errors?.price)}
                    {...register(`variants.${index}.price`)}
                  />
                </TableCell>
                <TableCell>
                  <Input aria-label={`SKU of ${label}`} {...register(`variants.${index}.sku`)} />
                </TableCell>
                <TableCell>
                  <Input
                    inputMode="numeric"
                    aria-label={`Available of ${label}`}
                    aria-invalid={Boolean(errors?.quantity)}
                    {...register(`variants.${index}.quantity`)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
