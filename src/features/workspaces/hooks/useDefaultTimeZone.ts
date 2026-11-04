import { useEffect, useRef } from 'react';
import { WorkspacePermission } from '@/api/schema';
import { browserTimeZone } from '../time-zones';
import { hasPermission } from '../workspace-role';
import type { Workspace } from './useCurrentWorkspace';
import { useUpdateWorkspace } from './useWorkspaceMutations';

/**
 * Gives a workspace without a time zone the zone of the first person who may set it, once, so
 * reports follow a real calendar instead of UTC. They can change it in the workspace settings.
 */
export function useDefaultTimeZone(workspace: Workspace | undefined): void {
  const update = useUpdateWorkspace(workspace?.id ?? '');
  const attempted = useRef<string | null>(null);
  useEffect(() => {
    if (!workspace || workspace.timeZone !== null || attempted.current === workspace.id) return;
    if (!hasPermission(workspace, WorkspacePermission.workspace_manage)) return;
    attempted.current = workspace.id;
    update.mutate({ timeZone: browserTimeZone() });
  }, [workspace, update]);
}
