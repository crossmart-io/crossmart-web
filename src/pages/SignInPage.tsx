import { Link } from 'react-router';
import { ROUTES } from '@/config/routes';
import { AuthCard, useAuthNavigationState, SignInForm } from '@/features/auth';

export function SignInPage() {
  // Keeps where to go next, such as an invitation, when switching between the two forms.
  const navigationState = useAuthNavigationState();
  return (
    <AuthCard
      title="Sign in"
      description="Welcome back to Crossmart."
      footer={
        <p>
          New to Crossmart?{' '}
          <Link
            to={ROUTES.signUp}
            state={navigationState}
            className="font-medium text-foreground underline"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <SignInForm />
    </AuthCard>
  );
}
