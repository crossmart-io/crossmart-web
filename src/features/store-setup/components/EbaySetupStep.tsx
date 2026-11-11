import type { RefObject } from 'react';
import { FormProvider } from 'react-hook-form';
import { FormError } from '@/components/feedback/FormError';
import type { ChannelConnection } from '@/features/channels';
import type { EbaySettings } from '@/features/channels/channels.types';
import {
  EbayPolicyFields,
  EbayShipFromFields,
} from '@/features/channels/components/EbayDefaultsFields';
import { CreateDefaultsButton } from '@/features/channels/components/EbayPolicyActions';
import { isMissingPolicies } from '@/features/channels/ebay-defaults-form';
import { useEbayDefaultsForm } from '@/features/channels/hooks/useEbayDefaultsForm';
import type { SaveStep } from '../hooks/useStoreSetupSave';
import { useStepSave } from './useStepSave';

interface EbaySetupStepProps {
  workspaceId: string;
  connection: ChannelConnection;
  ebay: EbaySettings;
  stepRef: RefObject<SaveStep | null>;
}

/**
 * What eBay needs before it lists: a policy of each kind and where items ship from. Without
 * policies, creating eBay's defaults is the one-click way through.
 */
export function EbaySetupStep({ workspaceId, connection, ebay, stepRef }: EbaySetupStepProps) {
  const ref = { workspaceId, connectionId: connection.id };
  const { form, saveError, saveNow, choosePolicies } = useEbayDefaultsForm(
    ref,
    ebay.listingDefaults,
  );
  useStepSave(stepRef, saveNow);
  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-4">
        {isMissingPolicies(ebay.policies) && (
          <CreateDefaultsButton connection={ref} prominent onCreated={choosePolicies} />
        )}
        <EbayPolicyFields policies={ebay.policies} />
        <EbayShipFromFields />
        <FormError error={saveError} />
      </div>
    </FormProvider>
  );
}
