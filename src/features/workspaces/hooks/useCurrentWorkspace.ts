import type { components } from '@/api/schema';
import { useMe } from './useMe';

export type Workspace = components['schemas']['WorkspaceDto'];

interface CurrentWorkspaceState {
  workspace: Workspace | undefined;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => unknown;
}

/**
 * The workspace the app is acting on. Every new account has exactly one, so this is the first
 * membership until the workspace switcher for agencies lands.
 */
export function useCurrentWorkspace(): CurrentWorkspaceState {
  const { data, isPending, isError, error, refetch } = useMe();
  return { workspace: data?.workspaces[0], isPending, isError, error, refetch };
}
