const SEGMENT_SEPARATOR = '/';

/**
 * Whether `pathname` is `base` or a page under it, segment by segment: `/agent` covers
 * `/agent/review` but not `/agent-proposals`. With `exact`, only `base` itself matches.
 */
export function isPathWithin(pathname: string, base: string, exact = false): boolean {
  if (pathname === base) return true;
  if (exact) return false;
  const prefix = base.endsWith(SEGMENT_SEPARATOR) ? base : `${base}${SEGMENT_SEPARATOR}`;
  return pathname.startsWith(prefix);
}
