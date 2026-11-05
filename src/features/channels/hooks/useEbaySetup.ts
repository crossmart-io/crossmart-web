import { useMutation } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  CHANNEL_CONNECTION_DETAIL_ENDPOINT,
  CHANNEL_CONNECTIONS_ENDPOINT,
  EBAY_DEFAULT_POLICIES_ENDPOINT,
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
    mutationFn: (body) =>
      unwrap(
        fetchClient.PUT(EBAY_LISTING_DEFAULTS_ENDPOINT, {
          params: { path: ref },
          body,
        }),
      ),
    onSuccess: refresh,
  });
}

/** Opts the account in to business policies, then the API reads them again. */
export function useOptInToEbayPolicies(ref: ConnectionRef) {
  const refresh = useInvalidateEndpoints(CONNECTION_ENDPOINTS);
  return useMutation<ChannelConnection, Error>({
    meta: { successMessage: EBAY_DEFAULTS_COPY.optedIn },
    mutationFn: () =>
      unwrap(
        fetchClient.POST(EBAY_POLICIES_OPT_IN_ENDPOINT, {
          params: { path: ref },
        }),
      ),
    onSuccess: refresh,
  });
}

/** Reads the policies again, after the merchant edits them on eBay. */
export function useRefreshEbayPolicies(ref: ConnectionRef) {
  const refresh = useInvalidateEndpoints(CONNECTION_ENDPOINTS);
  return useMutation<ChannelConnection, Error>({
    meta: { successMessage: EBAY_DEFAULTS_COPY.refreshed },
    mutationFn: () =>
      unwrap(
        fetchClient.POST(EBAY_POLICIES_REFRESH_ENDPOINT, {
          params: { path: ref },
        }),
      ),
    onSuccess: refresh,
  });
}

/**
 * Creates free shipping, immediate payment and 30-day return policies on the eBay account
 * (opting it in first when needed); the API chooses them as the listing defaults.
 */
export function useCreateEbayDefaultPolicies(ref: ConnectionRef) {
  const refresh = useInvalidateEndpoints(CONNECTION_ENDPOINTS);
  return useMutation<ChannelConnection, Error>({
    meta: { successMessage: EBAY_DEFAULTS_COPY.defaultsCreated },
    mutationFn: () =>
      unwrap(
        fetchClient.POST(EBAY_DEFAULT_POLICIES_ENDPOINT, {
          params: { path: ref },
        }),
      ),
    onSuccess: refresh,
  });
}
