import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import { ROUTES } from '@/config/routes';
import { DELETION_FEEDBACK, ME_ENDPOINT, WORKSPACE_ENDPOINT } from '../workspaces.constants';

/** Deletes the workspace; the app then starts over in the workspace the API gives the user. */
export function useDeleteWorkspace(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    meta: { successMessage: DELETION_FEEDBACK.workspaceDeleted },
    mutationFn: async (confirmName) => {
      await unwrap(
        fetchClient.DELETE(WORKSPACE_ENDPOINT, {
          params: { path: { workspaceId } },
          body: { confirmName },
        }),
      );
    },
    // Every cached list belonged to the deleted workspace.
    onSuccess: () => queryClient.clear(),
  });
}

/**
 * Deletes the signed-in user's account. Their session ends with it, so the app reloads at
 * sign-in: a full load drops the session the browser still holds in memory.
 */
export function useDeleteAccount() {
  return useMutation<void, Error>({
    mutationFn: async () => {
      await unwrap(fetchClient.DELETE(ME_ENDPOINT));
    },
    onSuccess: () => window.location.assign(ROUTES.signIn),
  });
}
