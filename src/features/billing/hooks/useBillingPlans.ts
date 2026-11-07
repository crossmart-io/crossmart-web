import { api } from '@/api/client';
import { BILLING_PLANS_ENDPOINT } from '../billing.constants';

/** The plans on offer, with what each includes and costs. */
export function useBillingPlans() {
  return api.useQuery('get', BILLING_PLANS_ENDPOINT);
}
