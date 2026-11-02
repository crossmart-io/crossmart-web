import { authClient } from '@/api/auth-client';

const SESSION_SIGNAL = '$sessionSignal';

/**
 * Makes `useSession` fetch the session again. When the server no longer has one,
 * `RequireSession` sends the browser to sign-in and keeps the current page as the way back.
 */
export function refreshSession(): void {
  authClient.$store.notify(SESSION_SIGNAL);
}
