import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { AuthField, MIN_PASSWORD_LENGTH } from '../auth.constants';

export function NameField() {
  return (
    <Field>
      <FieldLabel htmlFor={AuthField.Name}>Name</FieldLabel>
      <Input id={AuthField.Name} name={AuthField.Name} autoComplete="name" required />
    </Field>
  );
}

export function EmailField() {
  return (
    <Field>
      <FieldLabel htmlFor={AuthField.Email}>Email</FieldLabel>
      <Input
        id={AuthField.Email}
        name={AuthField.Email}
        type="email"
        autoComplete="email"
        required
      />
    </Field>
  );
}

interface PasswordFieldProps {
  /** `new-password` on sign-up lets password managers offer a strong one. */
  autoComplete: 'current-password' | 'new-password';
  showHint?: boolean;
}

export function PasswordField({ autoComplete, showHint = false }: PasswordFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={AuthField.Password}>Password</FieldLabel>
      <Input
        id={AuthField.Password}
        name={AuthField.Password}
        type="password"
        autoComplete={autoComplete}
        minLength={MIN_PASSWORD_LENGTH}
        required
      />
      {showHint && <FieldDescription>At least {MIN_PASSWORD_LENGTH} characters.</FieldDescription>}
    </Field>
  );
}
