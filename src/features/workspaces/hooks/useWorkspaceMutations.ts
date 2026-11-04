import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import { endpointQueryKey } from '@/api/query-keys';
import type { components } from '@/api/schema';
import { selectWorkspace } from '../selected-workspace';
import {
  ME_ENDPOINT,
  ORGANIZATION_WORKSPACES_ENDPOINT,
  WORKSPACE_ENDPOINT,
  WORKSPACE_FEEDBACK,
} from '../workspaces.constants';

type NewWorkspace = components['schemas']['CreateWorkspaceDto'];

/** Creates a workspace in the organization and opens it, from a clean cache. */
export function useCreateWorkspace(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, NewWorkspace>({
    meta: { inlineError: true, successMessage: WORKSPACE_FEEDBACK.created },
    mutationFn: async (body) => {
      const { data, error } = await fetchClient.POST(ORGANIZATION_WORKSPACES_ENDPOINT, {
        params: { path: { organizationId } },
        body,
      });
      if (error) throw ApiRequestError.from(error);
      selectWorkspace(data.id);
    },
    // Every cached list belonged to the workspace the user left.
    onSuccess: () => queryClient.clear(),
  });
}

type WorkspaceChanges = components['schemas']['UpdateWorkspaceDto'];

/** Renames the workspace or sets its time zone; `successMessage` is the toast, if any. */
export function useUpdateWorkspace(workspaceId: string, successMessage?: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, WorkspaceChanges>({
    meta: { inlineError: true, ...(successMessage ? { successMessage } : {}) },
    mutationFn: async (body) => {
      const { error } = await fetchClient.PATCH(WORKSPACE_ENDPOINT, {
        params: { path: { workspaceId } },
        body,
      });
      if (error) throw ApiRequestError.from(error);
    },
    onSuccess: () =>
      Promise.all(
        [ME_ENDPOINT, WORKSPACE_ENDPOINT].map((endpoint) =>
          queryClient.invalidateQueries({ queryKey: endpointQueryKey(endpoint) }),
        ),
      ),
  });
}
