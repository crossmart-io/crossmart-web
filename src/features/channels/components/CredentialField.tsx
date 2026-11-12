import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CredentialFieldKind, type CredentialFieldPrompt } from '../channels.constants';

interface CredentialFieldProps {
  field: CredentialFieldPrompt;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const FIELD_ID_PREFIX = 'connect-credential-';

/** One value the merchant pastes: text, a masked key, or a choice such as the country. */
export function CredentialField({ field, value, onChange, disabled }: CredentialFieldProps) {
  const id = `${FIELD_ID_PREFIX}${field.key}`;
  return (
    <Field>
      <FieldLabel htmlFor={id}>{field.label}</FieldLabel>
      {field.kind === CredentialFieldKind.Select ? (
        <Select value={value} onValueChange={onChange} disabled={disabled} required>
          <SelectTrigger id={id} className="w-full">
            <SelectValue placeholder={field.label} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={field.kind === CredentialFieldKind.Secret ? 'password' : 'text'}
          autoComplete="off"
          spellCheck={false}
          placeholder={field.placeholder}
          disabled={disabled}
          required
        />
      )}
    </Field>
  );
}
