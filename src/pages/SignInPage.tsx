import { Link, useLocation } from 'react-router';
import { ROUTES } from '@/config/routes';
import { AuthCard, useAuthNavigationState, SignInForm } from '@/features/auth';

export function SignInPage() {
  // Keeps where to go next, such as an invitation, when switching between the two forms.
  const navigationState = useAuthNavigationState();
  // Keeps an AI agent's signed authorization query, so its sign-in continues either way.
  const { search } = useLocation();
  return (
    <AuthCard
      title="Sign in"
      description="Welcome back to Crossmart."
      footer={
        <p>
          New to Crossmart?{' '}
          <Link
            to={{ pathname: ROUTES.signUp, search }}
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
