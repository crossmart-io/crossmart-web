import { api } from '@/api/client';
import { ROLES_ENDPOINT } from '../workspaces.constants';

/** Every role of the workspace: the built-in ones with their permissions, and its own. */
export function useRoleCatalog(workspaceId: string) {
  return api.useQuery('get', ROLES_ENDPOINT, { params: { path: { workspaceId } } });
}
