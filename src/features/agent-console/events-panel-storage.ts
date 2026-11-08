/** Where the person's choice to hide the Events column is kept, in this browser. */
const EVENTS_COLLAPSED_STORAGE_KEY = 'crossmart.agent.events-collapsed';
const COLLAPSED = 'true';
const EXPANDED = 'false';

/** Storage may be blocked (private windows, blocked site data); the column is shown then. */
export function readEventsCollapsed(): boolean {
  try {
    return localStorage.getItem(EVENTS_COLLAPSED_STORAGE_KEY) === COLLAPSED;
  } catch {
    return false;
  }
}

export function storeEventsCollapsed(collapsed: boolean): void {
  try {
    localStorage.setItem(EVENTS_COLLAPSED_STORAGE_KEY, collapsed ? COLLAPSED : EXPANDED);
  } catch {
    // Not remembered in this browser; the choice still applies until reload.
  }
}
