import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { ROUTES } from '@/config/routes';
import { AuthField, PasswordField, readPassword } from '@/features/auth';
import { useClaimWithPassword } from '../hooks/useSandboxClaim';

interface ClaimPasswordFormProps {
  token: string;
  email: string;
}

/** The person chooses the password they sign in with, which claims the account. */
export function ClaimPasswordForm({ token, email }: ClaimPasswordFormProps) {
  const claim = useClaimWithPassword();
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = readPassword(new FormData(event.currentTarget), AuthField.Password);
    claim.mutate({ token, password }, { onSuccess: () => navigate(ROUTES.home) });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <FormError error={claim.error} />
        <p className="text-sm text-muted-foreground">
          Choose a password. You will sign in with it as {email}.
        </p>
        <PasswordField autoComplete="new-password" showHint />
        <Button type="submit" disabled={claim.isPending}>
          {claim.isPending ? 'Claiming…' : 'Claim account'}
        </Button>
      </FieldGroup>
    </form>
  );
}
