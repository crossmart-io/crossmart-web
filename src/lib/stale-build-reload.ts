/** Session key holding when the app last reloaded itself to pick up a new build. */
export const STALE_BUILD_RELOAD_KEY = 'crossmart:stale-build-reloaded-at';
/** Vite's event when a lazily loaded module fails to load. */
export const VITE_PRELOAD_ERROR_EVENT = 'vite:preloadError';
/** A second failure within this window is a real error, not a stale build, so it is shown. */
export const STALE_BUILD_RELOAD_WINDOW_MS = 10_000;

interface StaleBuildReloadDeps {
  storage: Pick<Storage, 'getItem' | 'setItem'>;
  reload: () => void;
  now: () => number;
}

function readTimestamp(storage: StaleBuildReloadDeps['storage']): number | null {
  try {
    const value = Number(storage.getItem(STALE_BUILD_RELOAD_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

/**
 * Reloads the page once when a lazily loaded module is missing. After a deploy, a tab that is
 * still open asks for the previous build's file names, which no longer exist; loading the page
 * again picks up the new build. Returns whether it reloaded.
 */
export function reloadForStaleBuild({ storage, reload, now }: StaleBuildReloadDeps): boolean {
  const lastReload = readTimestamp(storage);
  if (lastReload !== null && now() - lastReload < STALE_BUILD_RELOAD_WINDOW_MS) return false;
  try {
    storage.setItem(STALE_BUILD_RELOAD_KEY, String(now()));
  } catch {
    return false;
  }
  reload();
  return true;
}

/** Listens for Vite's failed-module event and reloads instead of showing an error page. */
export function installStaleBuildReload(target: Window = window): void {
  target.addEventListener(VITE_PRELOAD_ERROR_EVENT, (event) => {
    if (reloadWindowForStaleBuild(target)) event.preventDefault();
  });
}

/** How browsers word a failed lazy module load (Chromium, Safari and Firefox). */
const STALE_BUILD_ERROR_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /importing a module script failed/i,
  /error loading dynamically imported module/i,
] as const;

/** Whether an error is a lazily loaded module that is missing, as after a deploy. */
export function isStaleBuildError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return STALE_BUILD_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

/** Reloads the current window once for a stale build. Returns whether it reloaded. */
export function reloadWindowForStaleBuild(target: Window = window): boolean {
  return reloadForStaleBuild({
    storage: target.sessionStorage,
    reload: () => target.location.reload(),
    now: () => Date.now(),
  });
}
