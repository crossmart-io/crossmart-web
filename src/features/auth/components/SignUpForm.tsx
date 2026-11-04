import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { AuthField } from '../auth.constants';
import { useSignUp } from '../hooks/useSignUp';
import { readAuthField, readPassword } from '../read-auth-form';
import { EmailField, NameField, PasswordField } from './AuthFields';
import { AuthFormError } from './AuthFormError';

/** Signing up also signs in; the API creates the user's first workspace. */
export function SignUpForm() {
  const signUp = useSignUp();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    signUp.mutate({
      name: readAuthField(form, AuthField.Name),
      email: readAuthField(form, AuthField.Email),
      password: readPassword(form, AuthField.Password),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <AuthFormError error={signUp.error} />
        <NameField />
        <EmailField />
        <PasswordField autoComplete="new-password" showHint />
        <Button type="submit" disabled={signUp.isPending}>
          {signUp.isPending ? 'Creating your account…' : 'Create account'}
        </Button>
      </FieldGroup>
    </form>
  );
}
