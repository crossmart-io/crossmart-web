import { useMutation } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  CHANNEL_CONNECTION_DETAIL_ENDPOINT,
  CHANNEL_CONNECTIONS_ENDPOINT,
  EBAY_DEFAULTS_COPY,
  EBAY_LISTING_DEFAULTS_ENDPOINT,
  EBAY_POLICIES_OPT_IN_ENDPOINT,
  EBAY_POLICIES_REFRESH_ENDPOINT,
} from '../channels.constants';
import type { ChannelConnection, EbayListingDefaultsBody } from '../channels.types';

const CONNECTION_ENDPOINTS = [
  CHANNEL_CONNECTIONS_ENDPOINT,
  CHANNEL_CONNECTION_DETAIL_ENDPOINT,
] as const;

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

/** Saves the defaults; the API also saves the ship-from address on eBay. */
export function useSaveEbayDefaults(ref: ConnectionRef) {
  const refresh = useInvalidateEndpoints(CONNECTION_ENDPOINTS);
  return useMutation<ChannelConnection, Error, EbayListingDefaultsBody>({
    meta: { inlineError: true, successMessage: EBAY_DEFAULTS_COPY.saved },
    mutationFn: async (body) => {
      const { data, error } = await fetchClient.PUT(EBAY_LISTING_DEFAULTS_ENDPOINT, {
        params: { path: ref },
        body,
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: refresh,
  });
}

/** Opts the account in to business policies, then the API reads them again. */
export function useOptInToEbayPolicies(ref: ConnectionRef) {
  const refresh = useInvalidateEndpoints(CONNECTION_ENDPOINTS);
  return useMutation<ChannelConnection, Error>({
    meta: { successMessage: EBAY_DEFAULTS_COPY.optedIn },
    mutationFn: async () => {
      const { data, error } = await fetchClient.POST(EBAY_POLICIES_OPT_IN_ENDPOINT, {
        params: { path: ref },
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: refresh,
  });
}

/** Reads the policies again, after the merchant edits them on eBay. */
export function useRefreshEbayPolicies(ref: ConnectionRef) {
  const refresh = useInvalidateEndpoints(CONNECTION_ENDPOINTS);
  return useMutation<ChannelConnection, Error>({
    meta: { successMessage: EBAY_DEFAULTS_COPY.refreshed },
    mutationFn: async () => {
      const { data, error } = await fetchClient.POST(EBAY_POLICIES_REFRESH_ENDPOINT, {
        params: { path: ref },
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: refresh,
  });
}
