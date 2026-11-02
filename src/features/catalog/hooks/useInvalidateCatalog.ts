import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useInvalidateActivity } from '@/features/activity';
import { CATALOG_STATS_ENDPOINT, PRODUCT_ENDPOINT, PRODUCTS_ENDPOINT } from '../catalog.constants';

/** Same key prefix as the generated query hooks. */
const HTTP_METHOD_GET = 'get';

/** Refreshes every catalog query after a write: the list, product pages, the overview and the log. */
export function useInvalidateCatalog(): () => Promise<void> {
  const queryClient = useQueryClient();
  const invalidateActivity = useInvalidateActivity();
  return useCallback(async () => {
    await Promise.all([
      ...[PRODUCTS_ENDPOINT, PRODUCT_ENDPOINT, CATALOG_STATS_ENDPOINT].map((endpoint) =>
        queryClient.invalidateQueries({ queryKey: [HTTP_METHOD_GET, endpoint] }),
      ),
      invalidateActivity(),
    ]);
  }, [queryClient, invalidateActivity]);
}
