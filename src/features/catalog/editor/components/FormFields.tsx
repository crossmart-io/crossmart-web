import type { ReactNode } from 'react';
import { Controller, type FieldPath, useFormContext } from 'react-hook-form';
import { MoneyInput } from '@/components/forms/MoneyInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { ProductFormValues } from '../product-form.schema';

type ProductFieldPath = FieldPath<ProductFormValues>;

interface TextFieldProps {
  name: ProductFieldPath;
  label: string;
  description?: ReactNode;
  placeholder?: string;
  inputMode?: 'text' | 'numeric';
}

/** A labelled text input bound to the product form, with its validation message. */
export function TextField({ name, label, description, placeholder, inputMode }: TextFieldProps) {
  const { register, getFieldState, formState } = useFormContext<ProductFormValues>();
  const { error } = getFieldState(name, formState);

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        {...register(name)}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={[error]} />
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
        {...register(name)}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={[error]} />
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
