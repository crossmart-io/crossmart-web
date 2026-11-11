import type { RefObject } from 'react';
import { FormProvider } from 'react-hook-form';
import { FormError } from '@/components/feedback/FormError';
import type { ChannelConnection } from '@/features/channels';
import type { GoogleMerchantSettings } from '@/features/channels/channels.types';
import { GoogleSetupFields } from '@/features/channels/components/GoogleSetupFields';
import { useGoogleSetupForm } from '@/features/channels/hooks/useGoogleSetup';
import type { SaveStep } from '../hooks/useStoreSetupSave';
import { useStepSave } from './useStepSave';

interface GoogleSetupStepProps {
  workspaceId: string;
  connection: ChannelConnection;
  google: GoogleMerchantSettings;
  stepRef: RefObject<SaveStep | null>;
}

/** What Google needs before it lists: the country and each product's page on the website. */
export function GoogleSetupStep({
  workspaceId,
  connection,
  google,
  stepRef,
}: GoogleSetupStepProps) {
  const { form, saveError, saveNow } = useGoogleSetupForm(
    { workspaceId, connectionId: connection.id },
    google,
  );
  useStepSave(stepRef, saveNow);
  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-4">
        <GoogleSetupFields />
        <FormError error={saveError} />
      </div>
    </FormProvider>
  );
}
