import { api } from '@/api/client';
import { BILLING_STATUS_ENDPOINT } from '../billing.constants';
import { hasLiveSubscription } from '../billing';

/** The organization's subscription and what it may do under it (billing admins only). */
export function useBillingStatus(organizationId: string) {
  return api.useQuery('get', BILLING_STATUS_ENDPOINT, { params: { path: { organizationId } } });
}

/**
 * The subscription, asked for every `intervalMs` until the provider has confirmed it (a live
 * subscription), as after checkout. `intervalMs` false stops asking.
 */
export function useSubscriptionConfirmation(organizationId: string, intervalMs: number | false) {
  return api.useQuery(
    'get',
    BILLING_STATUS_ENDPOINT,
    { params: { path: { organizationId } } },
    {
      refetchInterval: ({ state: { data } }) =>
        data && hasLiveSubscription(data.status, data.hasBillingAccount) ? false : intervalMs,
    },
  );
}
