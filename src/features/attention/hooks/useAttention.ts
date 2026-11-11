import { useMemo } from 'react';
import { api } from '@/api/client';
import { attentionCounts } from '../attention-rows';
import {
  ATTENTION_ENDPOINT,
  ATTENTION_LIST_LIMIT,
  ATTENTION_REFRESH_MS,
} from '../attention.constants';
import type { AttentionCounts } from '../attention.types';

/**
 * What needs the merchant now: one query for Home, the sidebar badges and the bell, so their
 * numbers always agree. Every caller asks with the same limit, so they share the cache entry.
 */
export function useAttention(workspaceId: string | undefined) {
  return api.useQuery(
    'get',
    ATTENTION_ENDPOINT,
    {
      params: { path: { workspaceId: workspaceId ?? '' }, query: { limit: ATTENTION_LIST_LIMIT } },
    },
    { enabled: Boolean(workspaceId), refetchInterval: ATTENTION_REFRESH_MS },
  );
}

/** The attention counts, 0 while loading and for sections the person may not see. */
export function useAttentionCounts(workspaceId: string | undefined): AttentionCounts {
  const { data } = useAttention(workspaceId);
  return useMemo(() => attentionCounts(data), [data]);
}
