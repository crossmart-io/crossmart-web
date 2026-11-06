import { oauthProviderClient } from '@better-auth/oauth-provider/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { env } from '@/config/env';

/** Where the API serves Better Auth (sign-up, sign-in, sessions). Outside the versioned REST API. */
const AUTH_BASE_PATH = '/api/auth';

/**
 * Better Auth client for the session cookie flows. Everything else goes through `api`.
 * `oauthProviderClient` carries an agent's signed authorization query through sign-in, sign-up
 * and consent, so Better Auth can send the browser on to the agent (ADR 0019).
 */
export const authClient = createAuthClient({
  baseURL: env.apiUrl,
  basePath: AUTH_BASE_PATH,
  plugins: [
    oauthProviderClient(),
    inferAdditionalFields({
      session: {
        /** The workspace picked for the agent being authorized, set by the API. */
        oauthWorkspaceId: { type: 'string', required: false, input: false },
      },
    }),
  ],
});
