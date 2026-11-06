import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useMediaQuery } from './useMediaQuery';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Scrolls to the element the URL's hash names (`#listing-defaults`) once the page shows it, so a
 * link can send the merchant straight to the card where something is fixed. Pass `ready` false
 * while the section is still loading.
 */
export function useScrollToSection(ready = true): void {
  const { hash } = useLocation();
  const reduceMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  useEffect(() => {
    if (!ready || !hash) return;
    const section = document.getElementById(decodeURIComponent(hash.slice(1)));
    section?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [hash, ready, reduceMotion]);
}
