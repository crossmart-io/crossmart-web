import type { components } from '@/api/schema';
import { useSelectedWorkspaceId } from '../selected-workspace';
import { useMe } from './useMe';

export type Workspace = components['schemas']['WorkspaceDto'];

interface CurrentWorkspaceState {
  workspace: Workspace | undefined;
  workspaces: Workspace[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => unknown;
}

/**
 * The workspace the app is acting on: the one the user picked, or their first while they have
 * not picked one or have left the one they picked.
 */
export function useCurrentWorkspace(): CurrentWorkspaceState {
  const { data, isPending, isError, error, refetch } = useMe();
  const selectedId = useSelectedWorkspaceId();
  const workspaces = data?.workspaces ?? [];
  const workspace = workspaces.find((candidate) => candidate.id === selectedId) ?? workspaces[0];
  return { workspace, workspaces, isPending, isError, error, refetch };
}
