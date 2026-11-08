/** Where the sidebar choice for full-window pages is kept, in this browser. */
const FULL_PAGE_SIDEBAR_STORAGE_KEY = 'crossmart.sidebar.full-page-open';
const OPEN = 'true';
const CLOSED = 'false';

/**
 * Whether the sidebar is open on full-window pages such as Crossmart Agent: closed until the
 * person opens it there, then as they left it. Storage may be blocked; the default is used then.
 */
export function readFullPageSidebarOpen(): boolean {
  try {
    return localStorage.getItem(FULL_PAGE_SIDEBAR_STORAGE_KEY) === OPEN;
  } catch {
    return false;
  }
}

export function storeFullPageSidebarOpen(open: boolean): void {
  try {
    localStorage.setItem(FULL_PAGE_SIDEBAR_STORAGE_KEY, open ? OPEN : CLOSED);
  } catch {
    // Storage is blocked: the choice lasts until the page reloads.
  }
}
