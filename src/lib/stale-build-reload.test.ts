import {
  isStaleBuildError,
  reloadForStaleBuild,
  STALE_BUILD_RELOAD_KEY,
  STALE_BUILD_RELOAD_WINDOW_MS,
} from './stale-build-reload';

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
  };
}

const NOW = 1_000_000;

describe('reloadForStaleBuild', () => {
  it('reloads and remembers when it did', () => {
    const storage = memoryStorage();
    const reload = vi.fn<() => void>();

    expect(reloadForStaleBuild({ storage, reload, now: () => NOW })).toBe(true);
    expect(reload).toHaveBeenCalledOnce();
    expect(storage.getItem(STALE_BUILD_RELOAD_KEY)).toBe(String(NOW));
  });

  it('does not reload again right after a reload, so a real error is shown', () => {
    const storage = memoryStorage({ [STALE_BUILD_RELOAD_KEY]: String(NOW - 1_000) });
    const reload = vi.fn<() => void>();

    expect(reloadForStaleBuild({ storage, reload, now: () => NOW })).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads again once the window has passed', () => {
    const storage = memoryStorage({
      [STALE_BUILD_RELOAD_KEY]: String(NOW - STALE_BUILD_RELOAD_WINDOW_MS - 1),
    });
    const reload = vi.fn<() => void>();

    expect(reloadForStaleBuild({ storage, reload, now: () => NOW })).toBe(true);
  });

  it('does not reload when storage is unavailable, to avoid a reload loop', () => {
    const storage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('blocked');
      },
    };
    const reload = vi.fn<() => void>();

    expect(reloadForStaleBuild({ storage, reload, now: () => NOW })).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});

describe('isStaleBuildError', () => {
  it.each([
    'Failed to fetch dynamically imported module: https://app.crossmart.io/assets/MembersPage-BrPTlmul.js',
    'Importing a module script failed.',
    'error loading dynamically imported module',
  ])('recognises "%s"', (message) => {
    expect(isStaleBuildError(new TypeError(message))).toBe(true);
  });

  it('ignores other errors', () => {
    expect(isStaleBuildError(new Error('Request failed with status 500'))).toBe(false);
  });
});
