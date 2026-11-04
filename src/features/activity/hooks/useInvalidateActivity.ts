import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ACTIVITY_ENDPOINT, PRODUCT_ACTIVITY_ENDPOINT } from '../activity.constants';

/** Same key prefix as the generated query hooks. */
const HTTP_METHOD_GET = 'get';

/** Refreshes the activity log after a write that it records. */
export function useInvalidateActivity(): () => Promise<void> {
  const queryClient = useQueryClient();
  return useCallback(async () => {
    await Promise.all(
      [ACTIVITY_ENDPOINT, PRODUCT_ACTIVITY_ENDPOINT].map((endpoint) =>
        queryClient.invalidateQueries({ queryKey: [HTTP_METHOD_GET, endpoint] }),
      ),
    );
  }, [queryClient]);
}
