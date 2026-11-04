import { authClient } from '@/api/auth-client';

/** The current Better Auth session. `data` is null when signed out. */
export const useSession = authClient.useSession;
