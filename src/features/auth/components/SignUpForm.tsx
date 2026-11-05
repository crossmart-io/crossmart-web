import type { FormEvent } from 'react';
import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { AuthField, LEGAL_LINKS } from '../auth.constants';
import { useSignUp } from '../hooks/useSignUp';
import { readAuthField, readPassword } from '../read-auth-form';
import { EmailField, NameField, PasswordField } from './AuthFields';

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
        <FormError error={signUp.error} />
        <NameField />
        <EmailField />
        <PasswordField autoComplete="new-password" showHint />
        <Button type="submit" disabled={signUp.isPending}>
          {signUp.isPending ? 'Creating your account…' : 'Create account'}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By creating an account you agree to the{' '}
          <a href={LEGAL_LINKS.terms} target="_blank" rel="noreferrer" className="underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href={LEGAL_LINKS.privacy} target="_blank" rel="noreferrer" className="underline">
            Privacy Policy
          </a>
          , including how Crossmart processes your customers’ data.
        </p>
      </FieldGroup>
    </form>
  );
}
