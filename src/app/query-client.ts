import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isUnauthorizedError, toApiErrorMessage } from '@/api/api-error';
import { refreshSession } from '@/features/auth';
import './query-meta';

const ONE_MINUTE_MS = 60_000;
const MAX_QUERY_RETRIES = 1;

export function createAppQueryClient(): QueryClient {
  const queryClient: QueryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => handleUnauthorized(error, queryClient),
    }),
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        const message = mutation.meta?.successMessage;
        if (message) toast.success(message);
      },
      onError: (error, _variables, _context, mutation) => {
        if (handleUnauthorized(error, queryClient) || mutation.meta?.inlineError) return;
        toast.error(toApiErrorMessage(error));
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: ONE_MINUTE_MS,
        retry: (failureCount, error) =>
          !isUnauthorizedError(error) && failureCount < MAX_QUERY_RETRIES,
        refetchOnWindowFocus: false,
      },
    },
  });
  return queryClient;
}

/** An expired session drops the cache and goes back to sign-in. Returns whether it did. */
function handleUnauthorized(error: unknown, queryClient: QueryClient): boolean {
  if (!isUnauthorizedError(error)) return false;
  queryClient.clear();
  refreshSession();
  return true;
}
