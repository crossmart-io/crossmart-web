import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import { endpointQueryKey } from '@/api/query-keys';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  PREVIEW_DEBOUNCE_MS,
  PRICING_PREVIEW_ENDPOINT,
  SELECTION_PREVIEW_ENDPOINT,
  SELECTION_PREVIEW_PAGE_SIZE,
} from '../listings.constants';
import type { PricingRule, ProductSelectionRule } from '../listings.types';

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

/**
 * A rule (saved or not) applied to a real product, refreshed once typing pauses. Previews are
 * POSTs that change nothing, so they are queries keyed by the rule.
 */
export function usePricingPreview(ref: ConnectionRef, rule: PricingRule | null, enabled = true) {
  const debouncedRule = useDebouncedValue(rule, PREVIEW_DEBOUNCE_MS);
  return useQuery({
    queryKey: [...endpointQueryKey(PRICING_PREVIEW_ENDPOINT), ref, debouncedRule],
    queryFn: ({ signal }) =>
      unwrap(
        fetchClient.POST(PRICING_PREVIEW_ENDPOINT, {
          params: { path: ref },
          body: { rule: debouncedRule },
          signal,
        }),
      ),
    enabled,
    placeholderData: keepPreviousData,
  });
}

/** What a selection lists, with counts, refreshed once editing pauses. */
export function useSelectionPreview(ref: ConnectionRef, rule: ProductSelectionRule | null) {
  const debouncedRule = useDebouncedValue(rule, PREVIEW_DEBOUNCE_MS);
  return useQuery({
    queryKey: [...endpointQueryKey(SELECTION_PREVIEW_ENDPOINT), ref, debouncedRule],
    queryFn: ({ signal }) =>
      unwrap(
        fetchClient.POST(SELECTION_PREVIEW_ENDPOINT, {
          params: { path: ref, query: { limit: SELECTION_PREVIEW_PAGE_SIZE } },
          body: { rule: debouncedRule },
          signal,
        }),
      ),
    placeholderData: keepPreviousData,
  });
}
