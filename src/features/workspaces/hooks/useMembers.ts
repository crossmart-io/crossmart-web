import { api } from '@/api/client';

const MEMBERS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/members';

export function useMembers(workspaceId: string) {
  return api.useQuery('get', MEMBERS_ENDPOINT, { params: { path: { workspaceId } } });
}
