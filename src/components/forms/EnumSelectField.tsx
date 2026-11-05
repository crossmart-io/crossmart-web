import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type EnumOption, findOptionValue } from '@/lib/enum';
import { cn } from '@/lib/utils';

interface EnumSelectFieldProps<Values extends FieldValues, Name extends FieldPath<Values>> {
  control: Control<Values>;
  name: Name;
  /** For the field's `<FieldLabel htmlFor>`. */
  id: string;
  /** Every value the field takes, typed by the form, with its label. */
  options: readonly EnumOption<PathValue<Values, Name> & string>[];
  /** Classes for the trigger, which is full width by default. */
  className?: string;
}

/** A form menu over a closed set of values; it only ever sets one of `options`. */
export function EnumSelectField<Values extends FieldValues, Name extends FieldPath<Values>>({
  control,
  name,
  id,
  options,
  className,
}: EnumSelectFieldProps<Values, Name>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          value={field.value}
          onValueChange={(next) => {
            const value = findOptionValue(options, next);
            if (value !== undefined) field.onChange(value);
          }}
        >
          <SelectTrigger id={id} className={cn('w-full', className)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
