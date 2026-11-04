import { type RefObject, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/**
 * Moves focus to the page content after a client-side navigation, as a full page load would.
 * Without it, keyboard and screen reader users stay on the link they clicked.
 */
export function useFocusOnNavigation(target: RefObject<HTMLElement | null>): void {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    target.current?.focus({ preventScroll: true });
  }, [pathname, target]);
}
