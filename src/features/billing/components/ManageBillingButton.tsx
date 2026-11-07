import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BILLING_COPY } from '../billing.constants';
import { useOpenBillingPortal } from '../hooks/useHostedBillingPage';

/** Opens the payment provider's billing portal in this tab. */
export function ManageBillingButton({ organizationId }: { organizationId: string }) {
  const portal = useOpenBillingPortal(organizationId);
  return (
    <Button variant="outline" disabled={portal.isPending} onClick={() => portal.mutate()}>
      {BILLING_COPY.manageBilling}
      <ExternalLink data-icon="inline-end" />
    </Button>
  );
}
