import { api } from '@/api/client';
import { LISTING_HEALTH_ENDPOINT } from '../listing-health.constants';

export function useListingHealth(workspaceId: string) {
  return api.useQuery('get', LISTING_HEALTH_ENDPOINT, { params: { path: { workspaceId } } });
}
