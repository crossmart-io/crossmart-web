import { Link, useSearchParams } from 'react-router';
import { ROUTES } from '@/config/routes';
import { AUTH_LINK_QUERY, AuthCard, ResetPasswordForm } from '@/features/auth';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  return (
    <AuthCard
      title="Choose a new password"
      description="You will sign in with it from now on, on every device."
      footer={
        <p>
          <Link to={ROUTES.signIn} className="font-medium text-foreground underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <ResetPasswordForm
        token={searchParams.get(AUTH_LINK_QUERY.token)}
        linkError={searchParams.get(AUTH_LINK_QUERY.error)}
      />
    </AuthCard>
  );
}
