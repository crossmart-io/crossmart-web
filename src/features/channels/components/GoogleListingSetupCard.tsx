import { PageSection } from '@/config/routes';
import { TriangleAlert } from 'lucide-react';
import { SettingsFormCard } from '@/components/forms/SettingsFormCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GOOGLE_SETUP_COPY } from '../channels.constants';
import type { GoogleMerchantSettings } from '../channels.types';
import { useGoogleSetupForm } from '../hooks/useGoogleSetup';
import { GoogleSetupFields } from './GoogleSetupFields';

interface GoogleListingSetupCardProps {
  workspaceId: string;
  connectionId: string;
  googleMerchant: GoogleMerchantSettings;
  canManage: boolean;
}

/** Where every Google listing sells, and the website page each product links to. */
export function GoogleListingSetupCard({
  workspaceId,
  connectionId,
  googleMerchant,
  canManage,
}: GoogleListingSetupCardProps) {
  const { form, saveError, submit } = useGoogleSetupForm(
    { workspaceId, connectionId },
    googleMerchant,
  );
  return (
    <SettingsFormCard
      title={GOOGLE_SETUP_COPY.title}
      id={PageSection.StoreListingSetup}
      description={googleMerchant.readyToList ? undefined : GOOGLE_SETUP_COPY.notReady}
      form={form}
      onSubmit={submit}
      canManage={canManage}
      saveLabel={GOOGLE_SETUP_COPY.save}
      saveError={saveError}
      requireChanges={googleMerchant.readyToList}
      contentClassName="gap-5"
      before={
        !googleMerchant.homepageClaimed && (
          <Alert>
            <TriangleAlert />
            <AlertDescription>{GOOGLE_SETUP_COPY.homepageNotClaimed}</AlertDescription>
          </Alert>
        )
      }
    >
      <GoogleSetupFields />
    </SettingsFormCard>
  );
}
