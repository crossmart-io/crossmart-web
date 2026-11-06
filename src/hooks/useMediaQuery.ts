import { useSyncExternalStore } from 'react';

/** Tailwind's `lg` breakpoint, where the product editor gets its side column. */
export const DESKTOP_MEDIA_QUERY = '(min-width: 64rem)';
/** Below Tailwind's `md` breakpoint, where the sidebar becomes a sheet. */
const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
  );
}

/** Phone-sized screens, where the sidebar opens as a sheet. */
export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_MEDIA_QUERY);
}
