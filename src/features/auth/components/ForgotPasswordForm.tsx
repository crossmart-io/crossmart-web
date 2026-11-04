import { MailCheck } from 'lucide-react';
import type { FormEvent } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { AuthField } from '../auth.constants';
import { useRequestPasswordReset } from '../hooks/usePasswordReset';
import { readAuthField } from '../read-auth-form';
import { EmailField } from './AuthFields';
import { AuthFormError } from './AuthFormError';

export function ForgotPasswordForm() {
  const request = useRequestPasswordReset();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    request.mutate(readAuthField(new FormData(event.currentTarget), AuthField.Email));
  }

  if (request.isSuccess) {
    return (
      <Alert>
        <MailCheck />
        <AlertDescription>
          If an account uses that address, we sent it a link to choose a new password. The link
          works for one hour.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <AuthFormError error={request.error} />
        <EmailField />
        <Button type="submit" disabled={request.isPending}>
          {request.isPending ? 'Sending…' : 'Email me a link'}
        </Button>
      </FieldGroup>
    </form>
  );
}
