import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router';
import { HttpStatus } from '@/api/api-error';
import { ErrorState } from '@/components/feedback/ErrorState';
import { PageLoader } from '@/components/feedback/PageLoader';
import { ROUTES } from '@/config/routes';
import { SESSION_UNAVAILABLE_TITLE } from '../auth.constants';
import type { ReturnPathState } from '../hooks/useReturnPath';
import { useSession } from '../hooks/useSession';

type SessionError = ReturnType<typeof useSession>['error'];

/**
 * The session check failed for a reason other than being signed out: the network, or the
 * API itself. Sending the user to sign-in then would wrongly suggest they were logged out.
 * A network failure rejects with a TypeError, which has no `status`.
 */
function isUnreachable(error: SessionError): boolean {
  return error !== null && error.status !== HttpStatus.Unauthorized;
}

/** Renders its children only for a signed-in user; everyone else goes to sign-in. */
export function RequireSession({ children }: PropsWithChildren) {
  const { data: session, isPending, error, refetch } = useSession();
  const location = useLocation();

  if (isPending) return <PageLoader />;
  if (!session && isUnreachable(error)) {
    return (
      <div className="mx-auto grid min-h-svh max-w-lg place-items-center p-4">
        <ErrorState title={SESSION_UNAVAILABLE_TITLE} error={error} onRetry={() => refetch()} />
      </div>
    );
  }
  if (!session) {
    const state: ReturnPathState = { from: location.pathname + location.search };
    return <Navigate to={ROUTES.signIn} replace state={state} />;
  }
  return children;
}
