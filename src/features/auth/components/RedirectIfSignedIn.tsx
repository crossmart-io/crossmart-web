import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router';
import { PageLoader } from '@/components/feedback/PageLoader';
import { isAgentAuthorization } from '../agent-sign-in';
import { useReturnPath } from '../hooks/useReturnPath';
import { useSession } from '../hooks/useSession';

/**
 * Keeps signed-in users off the sign-in and sign-up screens, except during an AI agent's
 * authorization: there Better Auth sends the browser on to the agent once the user signs in.
 */
export function RedirectIfSignedIn({ children }: PropsWithChildren) {
  const { data: session, isPending } = useSession();
  const returnPath = useReturnPath();
  const { search } = useLocation();

  if (isPending) return <PageLoader />;
  if (session && !isAgentAuthorization(search)) return <Navigate to={returnPath} replace />;
  return children;
}
