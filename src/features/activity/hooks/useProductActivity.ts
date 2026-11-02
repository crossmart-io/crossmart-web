import { api } from '@/api/client';
import { PRODUCT_ACTIVITY_ENDPOINT, RECENT_PRODUCT_ACTIVITY_LIMIT } from '../activity.constants';

/** The latest events of one product, including bulk actions that touched it. */
export function useProductActivity(workspaceId: string, productId: string) {
  return api.useQuery(
    'get',
    PRODUCT_ACTIVITY_ENDPOINT,
    {
      params: {
        path: { workspaceId, productId },
        query: { limit: RECENT_PRODUCT_ACTIVITY_LIMIT },
      },
    },
    { staleTime: 0 },
  );
}
