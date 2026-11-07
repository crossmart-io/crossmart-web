import { Link, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import type { ReturnPathState } from '@/features/auth';

/** The person already has a password: they sign in, then come back here to claim. */
export function SignInToClaim({ email }: { email: string }) {
  const location = useLocation();
  const state: ReturnPathState = { from: location.pathname + location.search, email };
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        This account already has a password. Sign in as {email} to claim it.
      </p>
      <Button asChild>
        <Link to={ROUTES.signIn} state={state}>
          Sign in
        </Link>
      </Button>
    </div>
  );
}
