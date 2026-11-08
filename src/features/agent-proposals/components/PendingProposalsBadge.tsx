import { WorkspacePermission } from '@/api/schema';
import { SidebarMenuBadge } from '@/components/ui/sidebar';
import { hasPermission, useCurrentWorkspace } from '@/features/workspaces';
import { AGENT_PROPOSALS_COPY } from '../agent-proposals.constants';
import { usePendingProposalCount } from '../hooks/useAgentProposals';

/** The Agent proposals menu item's count of proposals waiting for a decision. */
export function PendingProposalsBadge() {
  const { workspace } = useCurrentWorkspace();
  const canView =
    workspace !== undefined && hasPermission(workspace, WorkspacePermission.suggestions_view);
  const pending = usePendingProposalCount(workspace?.id, canView);
  if (pending === 0) return null;
  return (
    <SidebarMenuBadge>
      {pending}
      <span className="sr-only"> {AGENT_PROPOSALS_COPY.pendingLabel(pending)}</span>
    </SidebarMenuBadge>
  );
}
