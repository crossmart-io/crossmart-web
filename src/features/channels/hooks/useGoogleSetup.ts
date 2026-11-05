import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
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
import {
  googleSetupFormSchema,
  type GoogleSetupFormValues,
  toGoogleSetupBody,
  toGoogleSetupForm,
} from '../google-setup-form';

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
    mutationFn: async (body) => {
      const { data, error } = await fetchClient.PUT(GOOGLE_LISTING_SETUP_ENDPOINT, {
        params: { path: ref },
        body,
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: refresh,
  });
}

/** The listing setup form, starting from the saved setup or the account's country and website. */
export function useGoogleSetupForm(ref: ConnectionRef, settings: GoogleMerchantSettings) {
  const form = useForm<GoogleSetupFormValues>({
    resolver: zodResolver(googleSetupFormSchema),
    defaultValues: toGoogleSetupForm(settings),
  });
  const save = useSaveGoogleSetup(ref);
  const submit = form.handleSubmit(async (values) => {
    const saved = await save.mutateAsync(toGoogleSetupBody(values));
    if (saved.googleMerchant) form.reset(toGoogleSetupForm(saved.googleMerchant));
  });
  return { form, saveError: save.error, submit };
}
