import { useMutation } from '@tanstack/react-query';
import { fetchClient } from '@/api/client';
import { unwrap } from '@/api/unwrap';
import type { components } from '@/api/schema';
import { MEMBERS_ENDPOINT, ROLE_ENDPOINT, ROLES_ENDPOINT } from '@/features/workspaces';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { ROLE_FEEDBACK } from '../roles.constants';

export type RoleInput = components['schemas']['CustomRoleInputDto'];

/** Members show role names, so they refresh with the roles. */
const ROLE_ENDPOINTS = [ROLES_ENDPOINT, MEMBERS_ENDPOINT];

/** Creates a role, or changes the one with `roleId`. */
export function useSaveRole(workspaceId: string, roleId?: string) {
  const refresh = useInvalidateEndpoints(ROLE_ENDPOINTS);
  return useMutation<void, Error, RoleInput>({
    meta: {
      inlineError: true,
      successMessage: roleId ? ROLE_FEEDBACK.updated : ROLE_FEEDBACK.created,
    },
    mutationFn: async (body) => {
      await unwrap(
        roleId
          ? fetchClient.PUT(ROLE_ENDPOINT, { params: { path: { workspaceId, roleId } }, body })
          : fetchClient.POST(ROLES_ENDPOINT, { params: { path: { workspaceId } }, body }),
      );
    },
    onSuccess: refresh,
  });
}

export function useDeleteRole(workspaceId: string) {
  const refresh = useInvalidateEndpoints(ROLE_ENDPOINTS);
  return useMutation<void, Error, string>({
    meta: { successMessage: ROLE_FEEDBACK.deleted },
    mutationFn: async (roleId) => {
      await unwrap(
        fetchClient.DELETE(ROLE_ENDPOINT, {
          params: { path: { workspaceId, roleId } },
        }),
      );
    },
    onSuccess: refresh,
  });
}
