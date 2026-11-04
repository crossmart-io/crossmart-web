import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/api/auth-client';
import { ROUTES } from '@/config/routes';
import { AuthRequestError } from '../auth-error';
import { toAppUrl } from '../auth.constants';

export function useResendVerification() {
  return useMutation<void, AuthRequestError, string>({
    meta: { inlineError: true },
    mutationFn: async (email) => {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: toAppUrl(ROUTES.home),
      });
      if (error) throw AuthRequestError.from(error);
    },
  });
}
