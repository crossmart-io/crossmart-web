import { Link, useNavigate } from 'react-router';
import { PageLoader } from '@/components/feedback/PageLoader';
import { ROUTES } from '@/config/routes';
import { AuthCard, useSession, WrongAccountNotice } from '@/features/auth';
import { formatDate } from '@/lib/format';
import { type SandboxClaimPreview, useSandboxClaimPreview } from '../hooks/useSandboxClaim';
import { ClaimAccountButton } from './ClaimAccountButton';
import { ClaimPasswordForm } from './ClaimPasswordForm';
import { SignInToClaim } from './SignInToClaim';

const HOME_LINK = (
  <Link to={ROUTES.home} className="font-medium text-foreground underline">
    Go to Crossmart
  </Link>
);

/** The page a sandbox claim email links to: what was opened, then claim it (ADR 0019). */
export function ClaimSandboxCard({ token }: { token: string }) {
  const preview = useSandboxClaimPreview(token);
  const { isPending: isSessionPending } = useSession();

  if (!token || preview.isError) {
    return (
      <AuthCard
        title="This link cannot be used"
        description="It was already used, replaced by a newer email, or has expired."
        footer={HOME_LINK}
      />
    );
  }
  if (preview.isPending || isSessionPending) return <PageLoader />;

  const sandbox = preview.data;
  return (
    <AuthCard
      title={`Claim ${sandbox.storeName}`}
      description={
        `An AI agent opened this Crossmart account for ${sandbox.email}. Claim it to keep ` +
        `what it built, connect your stores and publish. Unclaimed, it is deleted on ` +
        `${formatDate(sandbox.claimExpiresAt)}.`
      }
      footer={HOME_LINK}
    >
      <ClaimStep token={token} sandbox={sandbox} />
    </AuthCard>
  );
}

/** Choose a password, or sign in as the owner and claim, depending on who is here. */
function ClaimStep({ token, sandbox }: { token: string; sandbox: SandboxClaimPreview }) {
  const { data: session } = useSession();
  const navigate = useNavigate();
  if (!sandbox.passwordSet) return <ClaimPasswordForm token={token} email={sandbox.email} />;
  if (!session) return <SignInToClaim email={sandbox.email} />;
  if (session.user.email.toLowerCase() !== sandbox.email.toLowerCase()) {
    return (
      <WrongAccountNotice
        signedInAs={session.user.email}
        instruction={`Sign out, then sign in as ${sandbox.email} to claim it.`}
      />
    );
  }
  return (
    <ClaimAccountButton workspaceId={sandbox.workspaceId} onClaimed={() => navigate(ROUTES.home)} />
  );
}
