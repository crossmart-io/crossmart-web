import { FormProvider } from 'react-hook-form';
import { CardSaveFooter } from '@/components/forms/CardSaveFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{EBAY_DEFAULTS_COPY.title}</h2>
        </CardTitle>
        <CardDescription>
          {EBAY_DEFAULTS_COPY.description}{' '}
          {ebay.readyToList ? EBAY_DEFAULTS_COPY.ready : EBAY_DEFAULTS_COPY.notReady}
        </CardDescription>
      </CardHeader>
      <FormProvider {...form}>
        <form onSubmit={(event) => void submit(event)} noValidate>
          <CardContent className="flex flex-col gap-6">
            <fieldset disabled={!canManage} className="flex min-w-0 flex-col gap-5">
              <EbayPolicyFields policies={ebay.policies} />
              <EbayConditionField />
              <EbayShipFromFields />
            </fieldset>
            {canManage && (
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
            )}
          </CardContent>
          {canManage && (
            <CardSaveFooter
              label={EBAY_DEFAULTS_COPY.save}
              error={saveError}
              isSaving={form.formState.isSubmitting}
              disabled={!form.formState.isDirty}
            />
          )}
        </form>
      </FormProvider>
    </Card>
  );
}
