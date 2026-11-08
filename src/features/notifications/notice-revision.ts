import { REVISION_SEPARATOR } from './notifications.constants';

/** One fact a notice rests on: a date, a state, or whether a deadline window has started. */
export type NoticeFact = string | boolean | null;

/** The notice's revision: it changes only when one of its facts does. */
export function noticeRevision(...facts: NoticeFact[]): string {
  return facts.map(String).join(REVISION_SEPARATOR);
}
