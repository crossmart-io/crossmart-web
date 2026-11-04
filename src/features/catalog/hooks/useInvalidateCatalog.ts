import { useCallback } from 'react';
import { useInvalidateActivity } from '@/features/activity';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { CATALOG_STATS_ENDPOINT, PRODUCT_ENDPOINT, PRODUCTS_ENDPOINT } from '../catalog.constants';

const CATALOG_ENDPOINTS = [PRODUCTS_ENDPOINT, PRODUCT_ENDPOINT, CATALOG_STATS_ENDPOINT];

/** Refreshes every catalog query after a write: the list, product pages, the overview and the log. */
export function useInvalidateCatalog(): () => Promise<void> {
  const invalidateCatalog = useInvalidateEndpoints(CATALOG_ENDPOINTS);
  const invalidateActivity = useInvalidateActivity();
  return useCallback(async () => {
    await Promise.all([invalidateCatalog(), invalidateActivity()]);
  }, [invalidateCatalog, invalidateActivity]);
}
