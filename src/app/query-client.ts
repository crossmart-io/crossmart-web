import { QueryClient } from '@tanstack/react-query';

const ONE_MINUTE_MS = 60_000;
const MAX_QUERY_RETRIES = 1;

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: ONE_MINUTE_MS,
        retry: MAX_QUERY_RETRIES,
        refetchOnWindowFocus: false,
      },
    },
  });
}
