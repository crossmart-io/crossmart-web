import { CITATION_PROTOCOLS } from './ask.constants';

/** True for a well-formed http(s) URL, so a citation can never become a `javascript:` link. */
export function isWebUrl(url: string): boolean {
  try {
    return CITATION_PROTOCOLS.includes(new URL(url).protocol);
  } catch {
    return false;
  }
}
