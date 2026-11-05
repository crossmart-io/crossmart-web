import { api } from '@/api/client';
import { SUBSCRIPTION_ENDPOINT } from '../plan.constants';

/** The organization's plan, its limits and what is in use. */
export function useSubscription(organizationId: string) {
  return api.useQuery('get', SUBSCRIPTION_ENDPOINT, { params: { path: { organizationId } } });
}
