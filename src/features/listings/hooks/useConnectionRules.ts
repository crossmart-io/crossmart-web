import { useMutation } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import type { ChannelConnection } from '@/features/channels/channels.types';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  CHANNEL_CONNECTION_ENDPOINT,
  LISTINGS_FEEDBACK,
  PRODUCT_CHANNELS_ENDPOINT,
  PRICING_ENDPOINT,
  SELECTION_ENDPOINT,
} from '../listings.constants';
import type { PricingRule, ProductSelectionRule } from '../listings.types';

/** Rules change prices and selections everywhere they are shown. */
const RULE_ENDPOINTS = [CHANNEL_CONNECTION_ENDPOINT, PRODUCT_CHANNELS_ENDPOINT] as const;

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

export function useUpdatePricing({ workspaceId, connectionId }: ConnectionRef) {
  const refresh = useInvalidateEndpoints(RULE_ENDPOINTS);
  return useMutation<ChannelConnection, Error, PricingRule | null>({
    meta: { inlineError: true, successMessage: LISTINGS_FEEDBACK.pricingSaved },
    mutationFn: async (rule) => {
      const { data, error } = await fetchClient.PUT(PRICING_ENDPOINT, {
        params: { path: { workspaceId, connectionId } },
        body: { rule },
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: refresh,
  });
}

export function useUpdateSelection({ workspaceId, connectionId }: ConnectionRef) {
  const refresh = useInvalidateEndpoints(RULE_ENDPOINTS);
  return useMutation<ChannelConnection, Error, ProductSelectionRule | null>({
    meta: { inlineError: true, successMessage: LISTINGS_FEEDBACK.selectionSaved },
    mutationFn: async (rule) => {
      const { data, error } = await fetchClient.PUT(SELECTION_ENDPOINT, {
        params: { path: { workspaceId, connectionId } },
        body: { rule },
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: refresh,
  });
}
