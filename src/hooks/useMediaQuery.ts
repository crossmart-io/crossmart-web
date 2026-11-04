import { useSyncExternalStore } from 'react';

/** Tailwind's `lg` breakpoint, where the product editor gets its side column. */
export const DESKTOP_MEDIA_QUERY = '(min-width: 64rem)';
/** Phones and tablets, where hover-only controls would be unreachable. */
export const COARSE_POINTER_QUERY = '(pointer: coarse)';

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
