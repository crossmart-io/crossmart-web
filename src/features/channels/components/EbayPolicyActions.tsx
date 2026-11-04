import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { EBAY_BUSINESS_POLICIES_URL, EBAY_DEFAULTS_COPY } from '../channels.constants';
import { useOptInToEbayPolicies, useRefreshEbayPolicies } from '../hooks/useEbaySetup';

interface EbayPolicyActionsProps {
  workspaceId: string;
  connectionId: string;
  businessPoliciesEnabled: boolean;
}

/** Opting in to business policies, reading them again, and editing them on eBay. */
export function EbayPolicyActions({
  workspaceId,
  connectionId,
  businessPoliciesEnabled,
}: EbayPolicyActionsProps) {
  const ref = { workspaceId, connectionId };
  const optIn = useOptInToEbayPolicies(ref);
  const refresh = useRefreshEbayPolicies(ref);
  return (
    <div className="flex flex-col gap-2">
      {!businessPoliciesEnabled && (
        <p className="text-sm text-muted-foreground">{EBAY_DEFAULTS_COPY.policiesOff}</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {!businessPoliciesEnabled && (
          <Button type="button" disabled={optIn.isPending} onClick={() => optIn.mutate()}>
            {optIn.isPending && <Spinner data-icon="inline-start" />}
            {EBAY_DEFAULTS_COPY.optIn}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          disabled={refresh.isPending}
          onClick={() => refresh.mutate()}
        >
          {refresh.isPending && <Spinner data-icon="inline-start" />}
          {EBAY_DEFAULTS_COPY.refresh}
        </Button>
        <Button asChild variant="link">
          <a href={EBAY_BUSINESS_POLICIES_URL} target="_blank" rel="noreferrer">
            {EBAY_DEFAULTS_COPY.manage}
            <ExternalLink data-icon="inline-end" />
          </a>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{EBAY_DEFAULTS_COPY.manageNote}</p>
    </div>
  );
}
