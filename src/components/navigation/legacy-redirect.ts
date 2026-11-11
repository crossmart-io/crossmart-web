import type { Params } from 'react-router';

/** Where an old path now lives, given the old path's parameters. */
export type LegacyTarget = string | ((params: Params) => string);

interface OldLocation {
  search: string;
  hash: string;
}

/**
 * The new address of an old link: the target's path, its query merged with the old one's (the
 * old link's values win), and the old hash unless the target names its own section.
 */
export function legacyRedirectPath(target: string, from: OldLocation): string {
  const url = new URL(target, window.location.origin);
  new URLSearchParams(from.search).forEach((value, key) => url.searchParams.set(key, value));
  const hash = url.hash || from.hash;
  return `${url.pathname}${url.search}${hash}`;
}
