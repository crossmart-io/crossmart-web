import type { ReactNode } from 'react';
import type { FieldError as FormFieldError, UseFormRegisterReturn } from 'react-hook-form';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { MoneyInput } from '@/components/forms/MoneyInput';
import { FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { COST_HELP } from '../../catalog.constants';
import type { ProductFormValues } from '../product-form.schema';

const COST_HELP_ID = 'variants-cost-help';

/** The id of a cell's error message, so the input can point at it. */
function errorId(index: number, column: string): string {
  return `variants-${index}-${column}-error`;
}

function CellError({ id, error }: { id: string; error: FormFieldError | undefined }) {
  return <FieldError id={id} errors={[error]} className="mt-1 text-xs" />;
}

/** Price, SKU and stock of each variant, edited in place like a spreadsheet. */
export function VariantsGrid({ currency }: { currency: string }) {
  const { control } = useFormContext<ProductFormValues>();
  const variants = useFieldArray({ control, name: 'variants', keyName: 'rowKey' });

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variant</TableHead>
              <TableHead className="w-36">Price</TableHead>
              <TableHead className="w-36" aria-describedby={COST_HELP_ID}>
                Cost
              </TableHead>
              <TableHead className="w-40">SKU</TableHead>
              <TableHead className="w-28 text-right">Available</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.fields.map((variant, index) => (
              <VariantRow
                key={variant.rowKey}
                index={index}
                label={variant.optionValues.join(' / ')}
                currency={currency}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <p id={COST_HELP_ID} className="text-xs text-muted-foreground">
        Cost: {COST_HELP.toLowerCase()}
      </p>
    </div>
  );
}

interface CellParts {
  message: ReactNode;
  inputProps: { 'aria-invalid': boolean; 'aria-describedby': string | undefined };
}

interface MoneyCellProps {
  currency: string;
  label: string;
  cell: CellParts;
  field: UseFormRegisterReturn;
}

function MoneyCell({ currency, label, cell, field }: MoneyCellProps) {
  return (
    <TableCell>
      <MoneyInput
        currency={currency}
        placeholder="0.00"
        aria-label={label}
        {...cell.inputProps}
        {...field}
      />
      {cell.message}
    </TableCell>
  );
}

interface VariantRowProps {
  index: number;
  label: string;
  currency: string;
}

type VariantColumn = 'price' | 'cost' | 'sku' | 'quantity';

function VariantRow({ index, label, currency }: VariantRowProps) {
  const { register, formState } = useFormContext<ProductFormValues>();
  const rowErrors = formState.errors.variants?.[index];

  /** The cell's error, and the attributes that tie it to the input. */
  function cell(column: VariantColumn): CellParts {
    const error = rowErrors?.[column];
    const id = errorId(index, column);
    return {
      message: <CellError id={id} error={error} />,
      inputProps: { 'aria-invalid': Boolean(error), 'aria-describedby': error ? id : undefined },
    };
  }
  const price = cell('price');
  const cost = cell('cost');
  const sku = cell('sku');
  const quantity = cell('quantity');

  return (
    <TableRow className="align-top">
      <TableCell className="pt-4 font-medium">{label}</TableCell>
      <MoneyCell
        currency={currency}
        label={`Price of ${label}`}
        cell={price}
        field={register(`variants.${index}.price`)}
      />
      <MoneyCell
        currency={currency}
        label={`Cost of ${label}`}
        cell={cost}
        field={register(`variants.${index}.cost`)}
      />
      <TableCell>
        <Input
          aria-label={`SKU of ${label}`}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          {...sku.inputProps}
          {...register(`variants.${index}.sku`)}
        />
        {sku.message}
      </TableCell>
      <TableCell>
        <Input
          inputMode="numeric"
          className="text-right tabular-nums"
          aria-label={`Available of ${label}`}
          {...quantity.inputProps}
          {...register(`variants.${index}.quantity`)}
        />
        {quantity.message}
      </TableCell>
    </TableRow>
  );
}
