import { useLocation } from 'react-router';

/** The current URL's path, query and hash, for tests that check where a link or redirect went. */
export function LocationDisplay() {
  const { pathname, search, hash } = useLocation();
  return <output data-testid="location">{`${pathname}${search}${hash}`}</output>;
}
