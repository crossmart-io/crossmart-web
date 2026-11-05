import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { ROUTES } from '@/config/routes';
import { AuthField } from '../auth.constants';
import { useSignIn } from '../hooks/useSignIn';
import { readAuthField, readPassword } from '../read-auth-form';
import { EmailField, PasswordField } from './AuthFields';

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
        <FormError error={signIn.error} />
        <EmailField />
        <PasswordField autoComplete="current-password" />
        <Link
          to={ROUTES.forgotPassword}
          className="-mt-3 self-end text-sm text-muted-foreground underline-offset-2 hover:underline"
        >
          Forgot your password?
        </Link>
        <Button type="submit" disabled={signIn.isPending}>
          {signIn.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </FieldGroup>
    </form>
  );
}
