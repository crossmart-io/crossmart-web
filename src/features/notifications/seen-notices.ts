import { useCallback, useSyncExternalStore } from 'react';
import { SEEN_NOTICES_STORAGE_KEY } from './notifications.constants';
import type { AccountNotice } from './notifications.types';

/** Notice key to the content seen under it, so changed content counts as new again. */
export type SeenNotices = Readonly<Record<string, string>>;

const NOTHING_SEEN: SeenNotices = {};
const listeners = new Set<() => void>();
/** Kept in memory as well, so the badge clears where storage is blocked. */
const seenByUser = new Map<string, SeenNotices>();

function storageKey(userId: string): string {
  return `${SEEN_NOTICES_STORAGE_KEY}:${userId}`;
}

function isSeenNotices(value: unknown): value is SeenNotices {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  return Object.values(value).every((fingerprint) => typeof fingerprint === 'string');
}

/** Storage can throw in private windows or when site data is blocked; nothing is seen then. */
function readStored(userId: string): SeenNotices {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(storageKey(userId)) ?? 'null');
    return isSeenNotices(parsed) ? parsed : NOTHING_SEEN;
  } catch {
    return NOTHING_SEEN;
  }
}

function seenNoticesOf(userId: string): SeenNotices {
  let seen = seenByUser.get(userId);
  if (!seen) {
    seen = readStored(userId);
    seenByUser.set(userId, seen);
  }
  return seen;
}

/** What the notice says; a notice whose content changes is new again. */
export function noticeFingerprint(notice: AccountNotice): string {
  return `${notice.title}\n${notice.body}`;
}

/** The notices the user has not seen with their current content. */
export function unseenNotices(notices: AccountNotice[], seen: SeenNotices): AccountNotice[] {
  return notices.filter((notice) => seen[notice.key] !== noticeFingerprint(notice));
}

/** Remembers the current notices as seen; notices no longer listed are forgotten. */
export function markNoticesSeen(userId: string, notices: AccountNotice[]): void {
  const seen = Object.fromEntries(notices.map((notice) => [notice.key, noticeFingerprint(notice)]));
  seenByUser.set(userId, seen);
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(seen));
  } catch {
    // Not remembered in this browser; the badge stays clear until reload.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The notices this user has seen, nothing while signed out. */
export function useSeenNotices(userId: string | undefined): SeenNotices {
  const snapshot = useCallback(() => (userId ? seenNoticesOf(userId) : NOTHING_SEEN), [userId]);
  return useSyncExternalStore(subscribe, snapshot);
}
