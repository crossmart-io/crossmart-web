import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { AuthField } from '../auth.constants';
import { useSignIn } from '../hooks/useSignIn';
import { readAuthField, readPassword } from '../read-auth-form';
import { EmailField, PasswordField } from './AuthFields';
import { AuthFormError } from './AuthFormError';

/** On success the session updates and `RedirectIfSignedIn` moves the user on. */
export function SignInForm() {
  const signIn = useSignIn();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    signIn.mutate({
      email: readAuthField(form, AuthField.Email),
      password: readPassword(form, AuthField.Password),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <AuthFormError error={signIn.error} />
        <EmailField />
        <PasswordField autoComplete="current-password" />
        <Button type="submit" disabled={signIn.isPending}>
          {signIn.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </FieldGroup>
    </form>
  );
}
