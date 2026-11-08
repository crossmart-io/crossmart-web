import { Button } from '@/components/ui/button';
import { RESEND_VERIFICATION_COPY } from '../auth.constants';
import { useResendVerification } from '../hooks/useResendVerification';

/** Emails the confirmation link to `email` again, then says it was sent. */
export function ResendVerificationButton({ email }: { email: string }) {
  const resend = useResendVerification();
  if (resend.isSuccess) {
    return <output className="text-sm font-medium">{RESEND_VERIFICATION_COPY.sent}</output>;
  }
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={resend.isPending}
      onClick={() => resend.mutate(email)}
    >
      {RESEND_VERIFICATION_COPY.send}
    </Button>
  );
}
