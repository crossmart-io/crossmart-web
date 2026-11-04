import { MailWarning } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useResendVerification } from '../hooks/useResendVerification';
import { useSession } from '../hooks/useSession';

/** Asks a signed-in user to confirm their email, with a way to get the link again. */
export function VerifyEmailBanner() {
  const { data: session } = useSession();
  const resend = useResendVerification();
  if (!session || session.user.emailVerified) return null;

  return (
    <Alert className="mb-6">
      <MailWarning />
      <AlertTitle>Confirm your email</AlertTitle>
      <AlertDescription className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span>
          We sent a link to {session.user.email}. Confirming it lets you reset your password later.
        </span>
        {resend.isSuccess ? (
          <span className="font-medium">Sent. Check your inbox.</span>
        ) : (
          <Button
            size="sm"
            variant="outline"
            disabled={resend.isPending}
            onClick={() => resend.mutate(session.user.email)}
          >
            Send it again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
