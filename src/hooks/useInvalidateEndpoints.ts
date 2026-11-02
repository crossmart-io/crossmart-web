import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { endpointQueryKey } from '@/api/query-keys';

/**
 * Refetches every query on the given endpoints, whatever their parameters. Pass a constant
 * array (declared outside the component), so the returned function stays the same.
 */
export function useInvalidateEndpoints(endpoints: readonly string[]): () => Promise<void> {
  const queryClient = useQueryClient();
  return useCallback(async () => {
    await Promise.all(
      endpoints.map((endpoint) =>
        queryClient.invalidateQueries({ queryKey: endpointQueryKey(endpoint) }),
      ),
    );
  }, [queryClient, endpoints]);
}
