import { useSearchParams } from 'react-router';
import { Wordmark } from '@/components/brand/Wordmark';
import { AcceptInvitationCard, INVITATION_TOKEN_QUERY } from '@/features/workspaces';

/** Open to everyone: the invitee may not have an account yet. */
export function AcceptInvitationPage() {
  const [searchParams] = useSearchParams();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <Wordmark />
      <main className="w-full max-w-sm">
        <AcceptInvitationCard token={searchParams.get(INVITATION_TOKEN_QUERY) ?? ''} />
      </main>
    </div>
  );
}
