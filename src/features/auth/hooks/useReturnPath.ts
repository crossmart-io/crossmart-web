import { useLocation } from 'react-router';
import { ROUTES } from '@/config/routes';

/** Navigation state set by `RequireSession`, so sign-in can send the user back. */
export interface ReturnPathState {
  from?: string;
  /** An address to fill in, such as the one an invitation was sent to. */
  email?: string;
}

/** The navigation state to keep when moving between sign-in and sign-up. */
export function useAuthNavigationState(): ReturnPathState | null {
  return useLocation().state as ReturnPathState | null;
}

/** Where to go after signing in: the page that asked for it, or home. */
export function useReturnPath(): string {
  const state = useLocation().state as ReturnPathState | null;
  return state?.from ?? ROUTES.home;
}
