import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { ACTIVITY_ENDPOINT, PRODUCT_ACTIVITY_ENDPOINT } from '../activity.constants';

const ACTIVITY_ENDPOINTS = [ACTIVITY_ENDPOINT, PRODUCT_ACTIVITY_ENDPOINT];

/** Refreshes the activity log after a write that it records. */
export function useInvalidateActivity(): () => Promise<void> {
  return useInvalidateEndpoints(ACTIVITY_ENDPOINTS);
}
