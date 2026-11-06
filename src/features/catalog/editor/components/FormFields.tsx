import type { ReactNode } from 'react';
import { Controller, type FieldPath, useFormContext } from 'react-hook-form';
import { MoneyInput } from '@/components/forms/MoneyInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LabelRow } from '@/components/forms/LabelRow';
import type { ProductFormValues } from '../product-form.schema';

type ProductFieldPath = FieldPath<ProductFormValues>;

interface TextFieldProps {
  name: ProductFieldPath;
  label: string;
  description?: ReactNode;
  placeholder?: string;
  inputMode?: 'text' | 'numeric';
  maxLength?: number;
  /** Codes like SKUs and barcodes: no spell check, autocorrect or translation. */
  isCode?: boolean;
  /** A small action beside the label. */
  labelAction?: ReactNode;
}

/** Ids that tie a field's description and error to its control for screen readers. */
function describedByIds(
  name: string,
  hasDescription: boolean,
  hasError: boolean,
): string | undefined {
  const ids = [hasDescription && `${name}-description`, hasError && `${name}-error`].filter(
    Boolean,
  );
  return ids.length > 0 ? ids.join(' ') : undefined;
}

const CODE_INPUT_PROPS = {
  spellCheck: false,
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'off',
  translate: 'no',
} as const;

/** A labelled text input bound to the product form, with its validation message. */
export function TextField({
  name,
  label,
  description,
  placeholder,
  inputMode,
  maxLength,
  isCode = false,
  labelAction,
}: TextFieldProps) {
  const { register, getFieldState, formState } = useFormContext<ProductFormValues>();
  const { error } = getFieldState(name, formState);

  return (
    <Field data-invalid={Boolean(error)}>
      <LabelRow action={labelAction}>
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
      </LabelRow>
      <Input
        id={name}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={describedByIds(name, Boolean(description), Boolean(error))}
        {...(isCode ? CODE_INPUT_PROPS : {})}
        {...register(name)}
      />
      {description && <FieldDescription id={`${name}-description`}>{description}</FieldDescription>}
      <FieldError id={`${name}-error`} errors={[error]} />
    </Field>
  );
}

interface MoneyFieldProps {
  name: ProductFieldPath;
  label: string;
  currency: string;
  description?: ReactNode;
}

export function MoneyField({ name, label, currency, description }: MoneyFieldProps) {
  const { register, getFieldState, formState } = useFormContext<ProductFormValues>();
  const { error } = getFieldState(name, formState);

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <MoneyInput
        id={name}
        currency={currency}
        placeholder="0.00"
        aria-invalid={Boolean(error)}
        aria-describedby={describedByIds(name, Boolean(description), Boolean(error))}
        {...register(name)}
      />
      {description && <FieldDescription id={`${name}-description`}>{description}</FieldDescription>}
      <FieldError id={`${name}-error`} errors={[error]} />
    </Field>
  );
}

interface CheckboxFieldProps {
  name: ProductFieldPath;
  label: string;
}

export function CheckboxField({ name, label }: CheckboxFieldProps) {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field orientation="horizontal">
          <Checkbox
            id={name}
            checked={field.value === true}
            onCheckedChange={(checked) => field.onChange(checked === true)}
          />
          <FieldLabel htmlFor={name} className="font-normal">
            {label}
          </FieldLabel>
        </Field>
      )}
    />
  );
}
