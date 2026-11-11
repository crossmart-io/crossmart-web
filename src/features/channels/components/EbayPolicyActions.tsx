import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { EBAY_BUSINESS_POLICIES_URL, EBAY_DEFAULTS_COPY } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import {
  useCreateEbayDefaultPolicies,
  useOptInToEbayPolicies,
  useRefreshEbayPolicies,
} from '../hooks/useEbaySetup';

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

interface EbayPolicyActionsProps extends ConnectionRef {
  businessPoliciesEnabled: boolean;
  /** True when the account lacks a policy of some kind: creating defaults is the main action. */
  missingPolicies: boolean;
  /** Called with the connection once the default policies are created and chosen. */
  onDefaultsCreated: (connection: ChannelConnection) => void;
}

/** Creates the default policies; the main action while the account cannot list. */
export function CreateDefaultsButton({
  connection,
  prominent,
  onCreated,
}: {
  connection: ConnectionRef;
  prominent: boolean;
  onCreated: (connection: ChannelConnection) => void;
}) {
  const create = useCreateEbayDefaultPolicies(connection);
  return (
    <Button
      type="button"
      variant={prominent ? 'default' : 'outline'}
      disabled={create.isPending}
      onClick={() => create.mutate(undefined, { onSuccess: onCreated })}
    >
      {create.isPending && <Spinner data-icon="inline-start" />}
      {EBAY_DEFAULTS_COPY.createDefaults}
    </Button>
  );
}

function PolicyStatusNote({ enabled, missing }: { enabled: boolean; missing: boolean }) {
  if (!enabled) {
    return <p className="text-sm text-muted-foreground">{EBAY_DEFAULTS_COPY.policiesOff}</p>;
  }
  if (missing) {
    return <p className="text-sm text-muted-foreground">{EBAY_DEFAULTS_COPY.policiesMissing}</p>;
  }
  return null;
}

/** Creating default policies, opting in, reading them again, and editing them on eBay. */
export function EbayPolicyActions({
  workspaceId,
  connectionId,
  businessPoliciesEnabled,
  missingPolicies,
  onDefaultsCreated,
}: EbayPolicyActionsProps) {
  const ref = { workspaceId, connectionId };
  const optIn = useOptInToEbayPolicies(ref);
  const refresh = useRefreshEbayPolicies(ref);
  return (
    <div className="flex flex-col gap-2">
      <PolicyStatusNote enabled={businessPoliciesEnabled} missing={missingPolicies} />
      <div className="flex flex-wrap items-center gap-2">
        <CreateDefaultsButton
          connection={ref}
          prominent={missingPolicies}
          onCreated={onDefaultsCreated}
        />
        {!businessPoliciesEnabled && (
          <Button
            type="button"
            variant="outline"
            disabled={optIn.isPending}
            onClick={() => optIn.mutate()}
          >
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
      <p className="text-xs text-muted-foreground">{EBAY_DEFAULTS_COPY.createDefaultsNote}</p>
    </div>
  );
}
