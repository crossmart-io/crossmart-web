import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/api/auth-client';
import { AuthRequestError } from '../auth-error';

export interface SignUpDetails {
  name: string;
  email: string;
  password: string;
}

export function useSignUp() {
  return useMutation<void, AuthRequestError, SignUpDetails>({
    mutationFn: async (details) => {
      const { error } = await authClient.signUp.email(details);
      if (error) throw AuthRequestError.from(error);
    },
  });
}
