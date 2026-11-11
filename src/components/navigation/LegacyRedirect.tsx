import { Navigate, useLocation, useParams } from 'react-router';
import { type LegacyTarget, legacyRedirectPath } from './legacy-redirect';

/** Sends an old link (a bookmark, an email, an OAuth return) to the page that replaced it. */
export function LegacyRedirect({ to }: { to: LegacyTarget }) {
  const params = useParams();
  const location = useLocation();
  const target = typeof to === 'string' ? to : to(params);
  return <Navigate to={legacyRedirectPath(target, location)} replace />;
}
