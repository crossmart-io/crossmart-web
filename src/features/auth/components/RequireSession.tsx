import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router';
import { PageLoader } from '@/components/feedback/PageLoader';
import { ROUTES } from '@/config/routes';
import type { ReturnPathState } from '../hooks/useReturnPath';
import { useSession } from '../hooks/useSession';

/** Renders its children only for a signed-in user; everyone else goes to sign-in. */
export function RequireSession({ children }: PropsWithChildren) {
  const { data: session, isPending } = useSession();
  const location = useLocation();

  if (isPending) return <PageLoader />;
  if (!session) {
    const state: ReturnPathState = { from: location.pathname + location.search };
    return <Navigate to={ROUTES.signIn} replace state={state} />;
  }
  return children;
}
