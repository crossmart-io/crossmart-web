import { WorkspacePermission } from '@/api/schema';
import { hasPermission, useCurrentWorkspace } from '@/features/workspaces';
import { useAiStatus } from './useAiStatus';

export enum GenerateAvailability {
  /** The user may not ask AI for content; the action is not shown. */
  Hidden = 'hidden',
  /** AI is not configured on this server; the action is shown disabled, saying why. */
  NotConfigured = 'not_configured',
  Ready = 'ready',
}

/** Whether the current user can ask AI for content here, and why not. */
export function useGenerateAvailability(): GenerateAvailability {
  const { workspace } = useCurrentWorkspace();
  const { data: status } = useAiStatus(workspace?.id);
  if (!workspace || !hasPermission(workspace, WorkspacePermission.ai_generate)) {
    return GenerateAvailability.Hidden;
  }
  return status?.configured === false
    ? GenerateAvailability.NotConfigured
    : GenerateAvailability.Ready;
}
