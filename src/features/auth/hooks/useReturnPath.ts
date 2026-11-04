import { useLocation } from 'react-router';
import { ROUTES } from '@/config/routes';

/** Navigation state set by `RequireSession`, so sign-in can send the user back. */
export interface ReturnPathState {
  from?: string;
}

/** Where to go after signing in: the page that asked for it, or home. */
export function useReturnPath(): string {
  const state = useLocation().state as ReturnPathState | null;
  return state?.from ?? ROUTES.home;
}
