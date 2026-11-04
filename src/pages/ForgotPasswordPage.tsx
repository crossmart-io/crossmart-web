import { Link } from 'react-router';
import { ROUTES } from '@/config/routes';
import { AuthCard, ForgotPasswordForm } from '@/features/auth';

export function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email and we will send you a link to choose a new password."
      footer={
        <p>
          Remembered it?{' '}
          <Link to={ROUTES.signIn} className="font-medium text-foreground underline">
            Sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
