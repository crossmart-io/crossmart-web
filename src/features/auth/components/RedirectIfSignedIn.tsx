import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { PageLoader } from '@/components/feedback/PageLoader';
import { useReturnPath } from '../hooks/useReturnPath';
import { useSession } from '../hooks/useSession';

/** Keeps signed-in users off the sign-in and sign-up screens. */
export function RedirectIfSignedIn({ children }: PropsWithChildren) {
  const { data: session, isPending } = useSession();
  const returnPath = useReturnPath();

  if (isPending) return <PageLoader />;
  if (session) return <Navigate to={returnPath} replace />;
  return children;
}
