import { Link } from 'react-router';
import { ROUTES } from '@/config/routes';
import { AuthCard, SignUpForm } from '@/features/auth';

export function SignUpPage() {
  return (
    <AuthCard
      title="Create your account"
      description="One catalog for every channel you sell on."
      footer={
        <p>
          Already have an account?{' '}
          <Link to={ROUTES.signIn} className="font-medium text-foreground underline">
            Sign in
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
