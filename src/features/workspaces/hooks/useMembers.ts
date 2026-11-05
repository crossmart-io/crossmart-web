import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { api, fetchClient } from '@/api/client';
import type { components } from '@/api/schema';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
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

const MEMBER_LIST_ENDPOINTS = [MEMBERS_ENDPOINT];

export function useChangeMemberRole(workspaceId: string) {
  const refresh = useInvalidateEndpoints(MEMBER_LIST_ENDPOINTS);
  return useMutation<void, Error, RoleChange>({
    meta: { successMessage: MEMBERS_FEEDBACK.roleChanged },
    mutationFn: async ({ userId, ...assignment }) => {
      await unwrap(
        fetchClient.PATCH(MEMBER_ENDPOINT, {
          params: { path: { workspaceId, userId } },
          body: assignment,
        }),
      );
    },
    onSuccess: refresh,
  });
}

export function useRemoveMember(workspaceId: string) {
  const refresh = useInvalidateEndpoints(MEMBER_LIST_ENDPOINTS);
  return useMutation<void, Error, string>({
    meta: { successMessage: MEMBERS_FEEDBACK.removed },
    mutationFn: async (userId) => {
      await unwrap(
        fetchClient.DELETE(MEMBER_ENDPOINT, {
          params: { path: { workspaceId, userId } },
        }),
      );
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
      await unwrap(
        fetchClient.DELETE(MEMBERSHIP_ENDPOINT, {
          params: { path: { workspaceId } },
        }),
      );
    },
    onSuccess: () => queryClient.clear(),
  });
}
