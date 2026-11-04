import { Link } from 'react-router';
import { ROUTES } from '@/config/routes';
import { AuthCard, SignInForm } from '@/features/auth';

export function SignInPage() {
  return (
    <AuthCard
      title="Sign in"
      description="Welcome back to Crossmart."
      footer={
        <p>
          New to Crossmart?{' '}
          <Link to={ROUTES.signUp} className="font-medium text-foreground underline">
            Create an account
          </Link>
        </p>
      }
    >
      <SignInForm />
    </AuthCard>
  );
}
