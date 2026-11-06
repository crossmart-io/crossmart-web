import { type KeyboardEvent, useId, useState } from 'react';
import { toast } from 'sonner';
import { MoneyInput } from '@/components/forms/MoneyInput';
import { Button } from '@/components/ui/button';
import { FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { pluralize } from '@/lib/format';
import { variantFormSchema } from '../product-form.schema';
import { useBulkVariantEdit } from '../useBulkVariantEdit';
import {
  BULK_MONEY_FIELDS,
  BULK_VARIANT_FIELD_LABELS,
  BulkVariantField,
  bulkAppliedMessage,
  VARIANTS_COPY,
} from '../variants.constants';

const APPLY_KEY = 'Enter';
const BULK_FIELDS = Object.values(BulkVariantField);

/** The schema's message when `value` is not valid for `field`, or undefined when it is. */
function validationError(field: BulkVariantField, value: string): string | undefined {
  const result = variantFormSchema.shape[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

function isBulkVariantField(value: string): value is BulkVariantField {
  return BULK_FIELDS.some((field) => field === value);
}

interface BulkVariantEditorProps {
  /** Positions of the variants the edit sets, in the form's `variants` array. */
  indices: number[];
  currency: string;
  /** The button's visible text, e.g. "Set for all". */
  label: string;
  /** Read after the label by screen readers, to tell apart buttons with the same text. */
  context?: string;
}

/** Sets price, compare-at price or stock of many variants at once, in the unsaved form. */
export function BulkVariantEditor({ indices, currency, label, context }: BulkVariantEditorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" size="sm" variant="outline" disabled={indices.length === 0}>
          {label}
          {context && <span className="sr-only">, {context}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <BulkVariantForm indices={indices} currency={currency} onApplied={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

interface BulkVariantFormProps {
  indices: number[];
  currency: string;
  onApplied: () => void;
}

/** Not a <form>: it sits inside the product form, and Enter must not save the product. */
function BulkVariantForm({ indices, currency, onApplied }: BulkVariantFormProps) {
  const ids = { value: useId(), error: useId() };
  const [field, setField] = useState(BulkVariantField.Price);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();
  const applyBulkEdit = useBulkVariantEdit();
  const countLabel = pluralize(indices.length, 'variant');

  function apply() {
    const trimmed = value.trim();
    const message = validationError(field, trimmed);
    setError(message);
    if (message) return;
    applyBulkEdit(indices, field, trimmed);
    toast(bulkAppliedMessage(BULK_VARIANT_FIELD_LABELS[field], countLabel));
    onApplied();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== APPLY_KEY) return;
    event.preventDefault();
    apply();
  }

  function changeField(next: string) {
    // A single-choice toggle group reports '' when its pressed item is pressed again.
    if (!isBulkVariantField(next)) return;
    setField(next);
    setError(undefined);
  }

  const inputProps = {
    id: ids.value,
    value,
    onChange: (event: { target: { value: string } }) => setValue(event.target.value),
    onKeyDown: handleKeyDown,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? ids.error : undefined,
  };

  return (
    <fieldset className="flex min-w-0 flex-col gap-3">
      <legend className="mb-3 text-sm font-medium">
        {VARIANTS_COPY.bulkTitle} {countLabel}
      </legend>
      <BulkFieldPicker field={field} onChange={changeField} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={ids.value}>{VARIANTS_COPY.bulkValueLabel}</Label>
        {BULK_MONEY_FIELDS.has(field) ? (
          <MoneyInput currency={currency} placeholder="0.00" {...inputProps} />
        ) : (
          <Input inputMode="numeric" className="tabular-nums" placeholder="0" {...inputProps} />
        )}
        <FieldError id={ids.error} errors={error ? [{ message: error }] : []} className="text-xs" />
        {field === BulkVariantField.CompareAtPrice && (
          <p className="text-xs text-muted-foreground">{VARIANTS_COPY.bulkClearHint}</p>
        )}
      </div>
      <Button type="button" size="sm" className="self-end" onClick={apply}>
        {VARIANTS_COPY.apply}
      </Button>
    </fieldset>
  );
}

function BulkFieldPicker({
  field,
  onChange,
}: {
  field: BulkVariantField;
  onChange: (next: string) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={field}
      onValueChange={onChange}
      aria-label={VARIANTS_COPY.bulkFieldLabel}
      className="w-full"
    >
      {BULK_FIELDS.map((option) => (
        <ToggleGroupItem key={option} value={option} className="flex-1">
          {BULK_VARIANT_FIELD_LABELS[option]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
