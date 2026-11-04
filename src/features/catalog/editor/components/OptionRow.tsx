import { Trash2 } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import { TagInput } from '@/components/forms/TagInput';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { ProductFormValues } from '../product-form.schema';

interface OptionRowProps {
  index: number;
  onValuesChange: () => void;
  onRemove: () => void;
}

/** One option: its name and its values. */
export function OptionRow({ index, onValuesChange, onRemove }: OptionRowProps) {
  const { control, register, formState } = useFormContext<ProductFormValues>();
  const errors = formState.errors.options?.[index];

  return (
    <div className="grid gap-3 rounded-md border p-3 sm:grid-cols-[10rem_1fr_auto]">
      <Field data-invalid={Boolean(errors?.name)}>
        <FieldLabel htmlFor={`options.${index}.name`}>Option name</FieldLabel>
        <Input id={`options.${index}.name`} {...register(`options.${index}.name`)} />
        <FieldError errors={[errors?.name]} />
      </Field>
      <Controller
        control={control}
        name={`options.${index}.values`}
        render={({ field }) => (
          <Field data-invalid={Boolean(errors?.values)}>
            <FieldLabel htmlFor={`options.${index}.values`}>Values</FieldLabel>
            <TagInput
              id={`options.${index}.values`}
              value={field.value}
              onChange={(values) => {
                field.onChange(values);
                onValuesChange();
              }}
              placeholder="Type a value and press Enter"
              aria-invalid={Boolean(errors?.values)}
            />
            <FieldError errors={[errors?.values]} />
          </Field>
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="self-end"
        onClick={onRemove}
        aria-label={`Remove option ${index + 1}`}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
