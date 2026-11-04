import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/api/auth-client';
import { AuthRequestError } from '../auth-error';

/**
 * Ends the session and drops every cached query, so the next user starts clean.
 * `RequireSession` then sends the browser to sign-in.
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation<void, AuthRequestError>({
    mutationFn: async () => {
      const { error } = await authClient.signOut();
      if (error) throw AuthRequestError.from(error);
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
