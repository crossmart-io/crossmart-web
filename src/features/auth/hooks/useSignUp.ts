import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/api/auth-client';
import { ROUTES } from '@/config/routes';
import { AuthRequestError } from '../auth-error';
import { toAppUrl } from '../auth.constants';

interface SignUpDetails {
  name: string;
  email: string;
  password: string;
}

export function useSignUp() {
  return useMutation<void, AuthRequestError, SignUpDetails>({
    meta: { inlineError: true },
    mutationFn: async (details) => {
      const { error } = await authClient.signUp.email({
        ...details,
        callbackURL: toAppUrl(ROUTES.home),
      });
      if (error) throw AuthRequestError.from(error);
    },
  });
}
