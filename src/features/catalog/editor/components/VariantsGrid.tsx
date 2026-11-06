import type { ReactNode } from 'react';
import type { FieldError as FormFieldError, UseFormRegisterReturn } from 'react-hook-form';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { MoneyInput } from '@/components/forms/MoneyInput';
import { FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { COST_HELP } from '../../catalog.constants';
import type { ProductFormValues } from '../product-form.schema';
import { useVariantGroups } from '../useVariantGroups';
import { variantLabel } from '../variant-groups';
import { VariantRows } from './VariantRows';
import { VariantsToolbar } from './VariantsToolbar';

const COST_HELP_ID = 'variants-cost-help';
const COLUMN_COUNT = 5;

type VariantColumn = 'price' | 'cost' | 'sku' | 'quantity';

const COLUMN_LABELS: Record<VariantColumn, string> = {
  price: 'Price',
  cost: 'Cost',
  sku: 'SKU',
  quantity: 'Available',
};

/**
 * Below `sm` the table stacks: each variant becomes a small card of labelled fields, since five
 * inputs side by side do not fit a phone. From `sm` up it is a regular table again.
 */
const STACKED = {
  table: 'block sm:table',
  body: 'block sm:table-row-group',
  row: 'grid grid-cols-2 gap-x-3 gap-y-1 p-2 sm:table-row sm:p-0',
  cell: 'block p-0 sm:table-cell sm:p-2',
  nameCell: 'col-span-2 block p-0 pt-1 sm:table-cell sm:p-2 sm:pt-4',
} as const;

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
  const layout = useVariantGroups();

  return (
    <div className="flex flex-col gap-2">
      {variants.fields.length > 1 && <VariantsToolbar layout={layout} currency={currency} />}
      <div className="rounded-lg border">
        <Table className={STACKED.table}>
          <TableHeader className="hidden sm:table-header-group">
            <TableRow>
              <TableHead>Variant</TableHead>
              <TableHead className="w-36">{COLUMN_LABELS.price}</TableHead>
              <TableHead className="w-36" aria-describedby={COST_HELP_ID}>
                {COLUMN_LABELS.cost}
              </TableHead>
              <TableHead className="w-40">{COLUMN_LABELS.sku}</TableHead>
              <TableHead className="w-28 text-right">{COLUMN_LABELS.quantity}</TableHead>
            </TableRow>
          </TableHeader>
          <VariantRows
            layout={layout}
            currency={currency}
            columnCount={COLUMN_COUNT}
            bodyClassName={STACKED.body}
            renderRow={(index) => (
              <VariantRow
                key={variants.fields[index]?.rowKey ?? index}
                index={index}
                label={variantLabel(variants.fields[index]?.optionValues ?? [])}
                currency={currency}
              />
            )}
          />
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

interface StackedCellProps {
  column: VariantColumn;
  children: ReactNode;
}

/** A cell that names its column itself while the table is stacked on phones. */
function StackedCell({ column, children }: StackedCellProps) {
  return (
    <TableCell className={STACKED.cell}>
      <span className="mb-1 block text-xs text-muted-foreground sm:hidden" aria-hidden="true">
        {COLUMN_LABELS[column]}
      </span>
      {children}
    </TableCell>
  );
}

interface MoneyCellProps {
  currency: string;
  column: VariantColumn;
  label: string;
  cell: CellParts;
  field: UseFormRegisterReturn;
}

function MoneyCell({ currency, column, label, cell, field }: MoneyCellProps) {
  return (
    <StackedCell column={column}>
      <MoneyInput
        currency={currency}
        placeholder="0.00"
        aria-label={label}
        {...cell.inputProps}
        {...field}
      />
      {cell.message}
    </StackedCell>
  );
}

interface VariantRowProps {
  index: number;
  label: string;
  currency: string;
}

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
    <TableRow className={cn('align-top', STACKED.row)}>
      <TableCell className={cn('font-medium whitespace-normal', STACKED.nameCell)}>
        {label}
      </TableCell>
      <MoneyCell
        currency={currency}
        column="price"
        label={`Price of ${label}`}
        cell={price}
        field={register(`variants.${index}.price`)}
      />
      <MoneyCell
        currency={currency}
        column="cost"
        label={`Cost of ${label}`}
        cell={cost}
        field={register(`variants.${index}.cost`)}
      />
      <StackedCell column="sku">
        <Input
          aria-label={`SKU of ${label}`}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          {...sku.inputProps}
          {...register(`variants.${index}.sku`)}
        />
        {sku.message}
      </StackedCell>
      <StackedCell column="quantity">
        <Input
          inputMode="numeric"
          className="text-right tabular-nums"
          aria-label={`Available of ${label}`}
          {...quantity.inputProps}
          {...register(`variants.${index}.quantity`)}
        />
        {quantity.message}
      </StackedCell>
    </TableRow>
  );
}
