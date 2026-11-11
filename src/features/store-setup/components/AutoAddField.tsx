import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field';
import { STORE_SETUP_COPY } from '../store-setup.constants';

const AUTO_ADD_FIELD_ID = 'store-setup-add-active';

interface AutoAddFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
}

/** Turns on the store's automatic rule for every active product; on unless the merchant unticks it. */
export function AutoAddField({ checked, onChange, disabled }: AutoAddFieldProps) {
  return (
    <Field orientation="horizontal">
      <Checkbox
        id={AUTO_ADD_FIELD_ID}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(next) => onChange(next === true)}
      />
      <FieldContent>
        <FieldLabel htmlFor={AUTO_ADD_FIELD_ID}>{STORE_SETUP_COPY.autoAdd}</FieldLabel>
        <FieldDescription>{STORE_SETUP_COPY.autoAddHint}</FieldDescription>
      </FieldContent>
    </Field>
  );
}
