import { createAuthClient } from 'better-auth/react';
import { env } from '@/config/env';

/** Where the API serves Better Auth (sign-up, sign-in, sessions). Outside the versioned REST API. */
const AUTH_BASE_PATH = '/api/auth';

/** Better Auth client for the session cookie flows. Everything else goes through `api`. */
export const authClient = createAuthClient({
  baseURL: env.apiUrl,
  basePath: AUTH_BASE_PATH,
});
