import { Link } from 'react-router';
import { ROUTES } from '@/config/routes';
import { AuthCard, useAuthNavigationState, SignUpForm } from '@/features/auth';

export function SignUpPage() {
  // Keeps where to go next, such as an invitation, when switching between the two forms.
  const navigationState = useAuthNavigationState();
  return (
    <AuthCard
      title="Create your account"
      description="One catalog for every channel you sell on."
      footer={
        <p>
          Already have an account?{' '}
          <Link
            to={ROUTES.signIn}
            state={navigationState}
            className="font-medium text-foreground underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
