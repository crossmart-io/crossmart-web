import { useMutation } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { useSaveableForm } from '@/hooks/useSaveableForm';
import {
  CHANNEL_CONNECTION_DETAIL_ENDPOINT,
  CHANNEL_CONNECTIONS_ENDPOINT,
  GOOGLE_LISTING_SETUP_ENDPOINT,
  GOOGLE_SETUP_COPY,
} from '../channels.constants';
import type {
  ChannelConnection,
  GoogleListingSetupBody,
  GoogleMerchantSettings,
} from '../channels.types';
import { googleSetupFormSchema, toGoogleSetupBody, toGoogleSetupForm } from '../google-setup-form';

const CONNECTION_ENDPOINTS = [
  CHANNEL_CONNECTIONS_ENDPOINT,
  CHANNEL_CONNECTION_DETAIL_ENDPOINT,
] as const;

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

/** Saves the setup; the API creates the country's data source on Google when it is new. */
function useSaveGoogleSetup(ref: ConnectionRef) {
  const refresh = useInvalidateEndpoints(CONNECTION_ENDPOINTS);
  return useMutation<ChannelConnection, Error, GoogleListingSetupBody>({
    meta: { inlineError: true, successMessage: GOOGLE_SETUP_COPY.saved },
    mutationFn: (body) =>
      unwrap(
        fetchClient.PUT(GOOGLE_LISTING_SETUP_ENDPOINT, {
          params: { path: ref },
          body,
        }),
      ),
    onSuccess: refresh,
  });
}

/** The listing setup form, starting from the saved setup or the account's country and website. */
export function useGoogleSetupForm(ref: ConnectionRef, settings: GoogleMerchantSettings) {
  const save = useSaveGoogleSetup(ref);
  const { form, submit } = useSaveableForm({
    schema: googleSetupFormSchema,
    defaults: toGoogleSetupForm(settings),
    save: (values) => save.mutateAsync(toGoogleSetupBody(values)),
    toForm: (saved) => (saved.googleMerchant ? toGoogleSetupForm(saved.googleMerchant) : null),
  });
  return { form, saveError: save.error, submit };
}
