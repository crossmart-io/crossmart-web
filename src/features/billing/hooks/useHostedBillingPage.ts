import { useMutation } from '@tanstack/react-query';
import { fetchClient } from '@/api/client';
import type { BillingInterval } from '@/api/schema';
import { unwrap } from '@/api/unwrap';
import { CHECKOUT_SESSIONS_ENDPOINT, PORTAL_SESSIONS_ENDPOINT } from '../billing.constants';

interface CheckoutChoice {
  planCode: string;
  interval: BillingInterval;
}

/** Leaves the app for the payment provider's page; the provider sends the browser back. */
function goTo(url: string): void {
  window.location.assign(url);
}

/** Starts checkout for a plan and interval on the provider's hosted page. */
export function useStartCheckout(organizationId: string) {
  return useMutation<void, Error, CheckoutChoice>({
    mutationFn: async (choice) => {
      const session = await unwrap(
        fetchClient.POST(CHECKOUT_SESSIONS_ENDPOINT, {
          params: { path: { organizationId } },
          body: choice,
        }),
      );
      goTo(session.url);
    },
  });
}

/** Opens the provider's billing portal: plan, card, cancellation and invoices. */
export function useOpenBillingPortal(organizationId: string) {
  return useMutation<void, Error>({
    mutationFn: async () => {
      const session = await unwrap(
        fetchClient.POST(PORTAL_SESSIONS_ENDPOINT, { params: { path: { organizationId } } }),
      );
      goTo(session.url);
    },
  });
}
