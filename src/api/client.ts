import createFetchClient from 'openapi-fetch';
import createQueryClient from 'openapi-react-query';
import { env } from '@/config/env';
import type { paths } from './schema';

/**
 * Typed client generated from the backend OpenAPI spec (`pnpm api:generate`).
 * Never hand-write request or response types: regenerate `schema.ts` instead.
 * Requests carry the session cookie, which the API accepts from `CORS_ORIGINS`.
 */
export const fetchClient = createFetchClient<paths>({
  baseUrl: env.apiUrl,
  credentials: 'include',
});

/** TanStack Query bindings: `api.useQuery('get', '/api/v1/...')`. */
export const api = createQueryClient(fetchClient);
