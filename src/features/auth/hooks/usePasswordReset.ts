import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/api/auth-client';
import { ROUTES } from '@/config/routes';
import { AuthRequestError } from '../auth-error';
import { toAppUrl } from '../auth.constants';

/** Asks for a reset link. The answer is the same whether or not the address has an account. */
export function useRequestPasswordReset() {
  return useMutation<void, AuthRequestError, string>({
    meta: { inlineError: true },
    mutationFn: async (email) => {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: toAppUrl(ROUTES.resetPassword),
      });
      if (error) throw AuthRequestError.from(error);
    },
  });
}

interface NewPassword {
  token: string;
  newPassword: string;
}

/** Sets the new password with the token from the emailed link. Other sessions are signed out. */
export function useResetPassword() {
  return useMutation<void, AuthRequestError, NewPassword>({
    meta: { inlineError: true },
    mutationFn: async (input) => {
      const { error } = await authClient.resetPassword(input);
      if (error) throw AuthRequestError.from(error);
    },
  });
}
