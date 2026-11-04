import { api } from '@/api/client';

const ME_ENDPOINT = '/api/v1/me';

/** The signed-in user and the workspaces they belong to. */
export function useMe() {
  return api.useQuery('get', ME_ENDPOINT);
}
