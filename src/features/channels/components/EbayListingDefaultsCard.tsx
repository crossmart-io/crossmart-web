import { SettingsFormCard } from '@/components/forms/SettingsFormCard';
import { Separator } from '@/components/ui/separator';
import { EBAY_DEFAULTS_COPY } from '../channels.constants';
import type { EbaySettings } from '../channels.types';
import { isMissingPolicies } from '../ebay-defaults-form';
import { useEbayDefaultsForm } from '../hooks/useEbayDefaultsForm';
import { EbayConditionField, EbayPolicyFields, EbayShipFromFields } from './EbayDefaultsFields';
import { EbayPolicyActions } from './EbayPolicyActions';

interface EbayListingDefaultsCardProps {
  workspaceId: string;
  connectionId: string;
  ebay: EbaySettings;
  canManage: boolean;
}

/** The policies, condition and ship-from address every eBay listing is published with. */
export function EbayListingDefaultsCard({
  workspaceId,
  connectionId,
  ebay,
  canManage,
}: EbayListingDefaultsCardProps) {
  const { form, saveError, submit, choosePolicies } = useEbayDefaultsForm(
    { workspaceId, connectionId },
    ebay.listingDefaults,
  );
  return (
    <SettingsFormCard
      title={EBAY_DEFAULTS_COPY.title}
      description={`${EBAY_DEFAULTS_COPY.description} ${
        ebay.readyToList ? EBAY_DEFAULTS_COPY.ready : EBAY_DEFAULTS_COPY.notReady
      }`}
      form={form}
      onSubmit={submit}
      canManage={canManage}
      saveLabel={EBAY_DEFAULTS_COPY.save}
      saveError={saveError}
      after={
        canManage && (
          <>
            <Separator />
            <EbayPolicyActions
              workspaceId={workspaceId}
              connectionId={connectionId}
              businessPoliciesEnabled={ebay.businessPoliciesEnabled}
              missingPolicies={isMissingPolicies(ebay.policies)}
              onDefaultsCreated={choosePolicies}
            />
          </>
        )
      }
    >
      <EbayPolicyFields policies={ebay.policies} />
      <EbayConditionField />
      <EbayShipFromFields />
    </SettingsFormCard>
  );
}
