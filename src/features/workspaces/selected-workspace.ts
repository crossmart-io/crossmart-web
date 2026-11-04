import { useSyncExternalStore } from 'react';
import { SELECTED_WORKSPACE_STORAGE_KEY } from './workspaces.constants';

const listeners = new Set<() => void>();
/** Kept in memory as well, so switching works where storage is blocked. */
let selectedId: string | null = readStored();

function readStored(): string | null {
  try {
    return localStorage.getItem(SELECTED_WORKSPACE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Makes `workspaceId` the workspace the app acts on, here and in later visits. */
export function selectWorkspace(workspaceId: string): void {
  selectedId = workspaceId;
  try {
    localStorage.setItem(SELECTED_WORKSPACE_STORAGE_KEY, workspaceId);
  } catch {
    // Not remembered in this browser; the choice still applies until reload.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The workspace id the user picked, or null when they never picked one. */
export function useSelectedWorkspaceId(): string | null {
  return useSyncExternalStore(subscribe, () => selectedId);
}
