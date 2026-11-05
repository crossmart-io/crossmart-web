import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { ROUTES } from '@/config/routes';
import { AuthRequestError } from '../auth-error';
import { AuthField } from '../auth.constants';
import { useResetPassword } from '../hooks/usePasswordReset';
import { readPassword } from '../read-auth-form';
import { PasswordField } from './AuthFields';

interface ResetPasswordFormProps {
  /** From the emailed link; null when the link was invalid or expired. */
  token: string | null;
  /** The error code Better Auth put on the link, if any. */
  linkError: string | null;
}

export function ResetPasswordForm({ token, linkError }: ResetPasswordFormProps) {
  const reset = useResetPassword();
  const navigate = useNavigate();

  if (!token || linkError) {
    return (
      <div className="flex flex-col gap-4">
        <FormError error={new AuthRequestError(linkError ?? undefined)} />
        <Button asChild variant="outline">
          <Link to={ROUTES.forgotPassword}>Get a new link</Link>
        </Button>
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newPassword = readPassword(new FormData(event.currentTarget), AuthField.Password);
    reset.mutate(
      { token: token ?? '', newPassword },
      { onSuccess: () => void navigate(ROUTES.signIn, { replace: true }) },
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <FormError error={reset.error} />
        <PasswordField autoComplete="new-password" showHint />
        <Button type="submit" disabled={reset.isPending}>
          {reset.isPending ? 'Saving…' : 'Save new password'}
        </Button>
      </FieldGroup>
    </form>
  );
}
