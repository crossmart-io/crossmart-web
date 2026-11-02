import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/api/auth-client';
import { AuthRequestError } from '../auth-error';

export interface SignInCredentials {
  email: string;
  password: string;
}

export function useSignIn() {
  return useMutation<void, AuthRequestError, SignInCredentials>({
    mutationFn: async (credentials) => {
      const { error } = await authClient.signIn.email(credentials);
      if (error) throw AuthRequestError.from(error);
    },
  });
}
