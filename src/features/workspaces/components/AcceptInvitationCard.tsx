import { CircleAlert } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { PageLoader } from '@/components/feedback/PageLoader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ROUTES } from '@/config/routes';
import { AuthCard, type ReturnPathState, useSession, useSignOut } from '@/features/auth';
import {
  type InvitationPreview,
  useAcceptInvitation,
  useInvitationPreview,
} from '../hooks/useInvitations';

const HOME_LINK = (
  <Link to={ROUTES.home} className="font-medium text-foreground underline">
    Go to Crossmart
  </Link>
);

/** The page an invitation email links to: who invited whom, then sign in and accept. */
export function AcceptInvitationCard({ token }: { token: string }) {
  const preview = useInvitationPreview(token);
  const { data: session, isPending: isSessionPending } = useSession();

  if (!token || preview.isError) {
    return (
      <AuthCard
        title="This invitation cannot be used"
        description="It was already used, revoked or has expired. Ask for a new one."
        footer={HOME_LINK}
      />
    );
  }
  if (preview.isPending || isSessionPending) return <PageLoader />;

  const invitation = preview.data;
  const title = `Join ${invitation.workspaceName}`;
  const description =
    `${invitation.inviterName} invited ${invitation.email} as ` + `${invitation.roleName}.`;

  return (
    <AuthCard title={title} description={description} footer={HOME_LINK}>
      {!session ? (
        <SignInToAccept invitation={invitation} />
      ) : session.user.email.toLowerCase() === invitation.email ? (
        <AcceptButton token={token} />
      ) : (
        <WrongAccount signedInAs={session.user.email} invitation={invitation} />
      )}
    </AuthCard>
  );
}

function SignInToAccept({ invitation }: { invitation: InvitationPreview }) {
  const location = useLocation();
  const state: ReturnPathState = {
    from: location.pathname + location.search,
    email: invitation.email,
  };
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Create an account or sign in with {invitation.email} to accept.
      </p>
      <Button asChild>
        <Link to={ROUTES.signUp} state={state}>
          Create an account
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link to={ROUTES.signIn} state={state}>
          Sign in
        </Link>
      </Button>
    </div>
  );
}

function AcceptButton({ token }: { token: string }) {
  const accept = useAcceptInvitation();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-3">
      {accept.error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertDescription>{accept.error.message}</AlertDescription>
        </Alert>
      )}
      <Button
        disabled={accept.isPending}
        onClick={() => accept.mutate(token, { onSuccess: () => navigate(ROUTES.home) })}
      >
        {accept.isPending && <Spinner data-icon="inline-start" />}
        {accept.isPending ? 'Joining…' : 'Accept invitation'}
      </Button>
    </div>
  );
}

interface WrongAccountProps {
  signedInAs: string;
  invitation: InvitationPreview;
}

function WrongAccount({ signedInAs, invitation }: WrongAccountProps) {
  const signOut = useSignOut();
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        You are signed in as {signedInAs}. Sign out, then sign in or create an account with{' '}
        {invitation.email}.
      </p>
      <Button variant="outline" disabled={signOut.isPending} onClick={() => signOut.mutate()}>
        Sign out
      </Button>
    </div>
  );
}
