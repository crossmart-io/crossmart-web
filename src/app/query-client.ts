import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { errorCodeOf, isUnauthorizedError } from '@/api/api-error';
import { endpointQueryKey } from '@/api/query-keys';
import { refreshSession } from '@/features/auth';
import { BILLING_ACCESS_ENDPOINT, SUBSCRIPTION_INACTIVE_CODE } from '@/features/billing';
import { showApiErrorToast } from './api-error-toast';
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
        if (handleUnauthorized(error, queryClient)) return;
        refreshBillingAccess(error, queryClient);
        if (!mutation.meta?.inlineError) showApiErrorToast(error);
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

/** A change refused as read-only: the billing banner reads the access again, so it shows at once. */
function refreshBillingAccess(error: unknown, queryClient: QueryClient): void {
  if (errorCodeOf(error) !== SUBSCRIPTION_INACTIVE_CODE) return;
  void queryClient.invalidateQueries({ queryKey: endpointQueryKey(BILLING_ACCESS_ENDPOINT) });
}

/** An expired session drops the cache and goes back to sign-in. Returns whether it did. */
function handleUnauthorized(error: unknown, queryClient: QueryClient): boolean {
  if (!isUnauthorizedError(error)) return false;
  queryClient.clear();
  refreshSession();
  return true;
}
