import { api } from '@/api/client';

import { ME_ENDPOINT } from '../workspaces.constants';

/** The signed-in user and the workspaces they belong to. */
export function useMe() {
  return api.useQuery('get', ME_ENDPOINT);
}
