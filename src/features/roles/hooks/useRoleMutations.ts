import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import { endpointQueryKey } from '@/api/query-keys';
import type { components } from '@/api/schema';
import { MEMBERS_ENDPOINT, ROLE_ENDPOINT, ROLES_ENDPOINT } from '@/features/workspaces';
import { ROLE_FEEDBACK } from '../roles.constants';

export type RoleInput = components['schemas']['CustomRoleInputDto'];

/** Members show role names, so they refresh with the roles. */
function useRefreshRoles() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all(
      [ROLES_ENDPOINT, MEMBERS_ENDPOINT].map((endpoint) =>
        queryClient.invalidateQueries({ queryKey: endpointQueryKey(endpoint) }),
      ),
    );
}

/** Creates a role, or changes the one with `roleId`. */
export function useSaveRole(workspaceId: string, roleId?: string) {
  const refresh = useRefreshRoles();
  return useMutation<void, Error, RoleInput>({
    meta: {
      inlineError: true,
      successMessage: roleId ? ROLE_FEEDBACK.updated : ROLE_FEEDBACK.created,
    },
    mutationFn: async (body) => {
      const { error } = roleId
        ? await fetchClient.PUT(ROLE_ENDPOINT, { params: { path: { workspaceId, roleId } }, body })
        : await fetchClient.POST(ROLES_ENDPOINT, { params: { path: { workspaceId } }, body });
      if (error) throw ApiRequestError.from(error);
    },
    onSuccess: refresh,
  });
}

export function useDeleteRole(workspaceId: string) {
  const refresh = useRefreshRoles();
  return useMutation<void, Error, string>({
    meta: { successMessage: ROLE_FEEDBACK.deleted },
    mutationFn: async (roleId) => {
      const { error } = await fetchClient.DELETE(ROLE_ENDPOINT, {
        params: { path: { workspaceId, roleId } },
      });
      if (error) throw ApiRequestError.from(error);
    },
    onSuccess: refresh,
  });
}
