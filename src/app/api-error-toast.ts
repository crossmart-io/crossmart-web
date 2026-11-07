import { toast } from 'sonner';
import { isPlanLimitError, toApiErrorMessage } from '@/api/api-error';
import { ROUTES } from '@/config/routes';
import { BILLING_COPY } from '@/features/billing';
import { router } from './router';

function openBilling(): void {
  void router.navigate(ROUTES.billing);
}

/**
 * The toast for a failed change. A 402 (a plan limit, or `subscription_inactive` from a read-only
 * organization) adds a link to Billing, where an owner or admin can fix it.
 */
export function showApiErrorToast(error: unknown): void {
  const message = toApiErrorMessage(error);
  if (!isPlanLimitError(error)) {
    toast.error(message);
    return;
  }
  toast.error(message, { action: { label: BILLING_COPY.billingAction, onClick: openBilling } });
}
