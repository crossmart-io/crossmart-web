import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { api, fetchClient } from '@/api/client';
import { endpointQueryKey } from '@/api/query-keys';
import type { components } from '@/api/schema';
import type { RoleAssignment } from '../role-options';
import {
  MEMBER_ENDPOINT,
  MEMBERS_ENDPOINT,
  MEMBERS_FEEDBACK,
  MEMBERSHIP_ENDPOINT,
} from '../workspaces.constants';

export type WorkspaceMember = components['schemas']['WorkspaceMemberDto'];

interface RoleChange extends RoleAssignment {
  userId: string;
}

export function useMembers(workspaceId: string) {
  return api.useQuery('get', MEMBERS_ENDPOINT, { params: { path: { workspaceId } } });
}

function useRefreshMembers() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: endpointQueryKey(MEMBERS_ENDPOINT) });
}

export function useChangeMemberRole(workspaceId: string) {
  const refresh = useRefreshMembers();
  return useMutation<void, Error, RoleChange>({
    meta: { successMessage: MEMBERS_FEEDBACK.roleChanged },
    mutationFn: async ({ userId, ...assignment }) => {
      const { error } = await fetchClient.PATCH(MEMBER_ENDPOINT, {
        params: { path: { workspaceId, userId } },
        body: assignment,
      });
      if (error) throw ApiRequestError.from(error);
    },
    onSuccess: refresh,
  });
}

export function useRemoveMember(workspaceId: string) {
  const refresh = useRefreshMembers();
  return useMutation<void, Error, string>({
    meta: { successMessage: MEMBERS_FEEDBACK.removed },
    mutationFn: async (userId) => {
      const { error } = await fetchClient.DELETE(MEMBER_ENDPOINT, {
        params: { path: { workspaceId, userId } },
      });
      if (error) throw ApiRequestError.from(error);
    },
    onSuccess: refresh,
  });
}

/** Leaves the workspace; the app then opens the user's next one, from a clean cache. */
export function useLeaveWorkspace(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error>({
    meta: { successMessage: MEMBERS_FEEDBACK.left },
    mutationFn: async () => {
      const { error } = await fetchClient.DELETE(MEMBERSHIP_ENDPOINT, {
        params: { path: { workspaceId } },
      });
      if (error) throw ApiRequestError.from(error);
    },
    onSuccess: () => queryClient.clear(),
  });
}
