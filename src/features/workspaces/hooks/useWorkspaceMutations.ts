import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import type { components } from '@/api/schema';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
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
      const data = await unwrap(
        fetchClient.POST(ORGANIZATION_WORKSPACES_ENDPOINT, {
          params: { path: { organizationId } },
          body,
        }),
      );
      selectWorkspace(data.id);
    },
    // Every cached list belonged to the workspace the user left.
    onSuccess: () => queryClient.clear(),
  });
}

type WorkspaceChanges = components['schemas']['UpdateWorkspaceDto'];

const WORKSPACE_ENDPOINTS = [ME_ENDPOINT, WORKSPACE_ENDPOINT];

/** Renames the workspace or sets its time zone; `successMessage` is the toast, if any. */
export function useUpdateWorkspace(workspaceId: string, successMessage?: string) {
  const refresh = useInvalidateEndpoints(WORKSPACE_ENDPOINTS);
  return useMutation<void, Error, WorkspaceChanges>({
    meta: { inlineError: true, ...(successMessage ? { successMessage } : {}) },
    mutationFn: async (body) => {
      await unwrap(
        fetchClient.PATCH(WORKSPACE_ENDPOINT, {
          params: { path: { workspaceId } },
          body,
        }),
      );
    },
    onSuccess: refresh,
  });
}
