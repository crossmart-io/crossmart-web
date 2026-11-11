import { WorkspacePermission } from '@/api/schema';
import { ReviewSource } from '@/config/routes';
import { usePendingProposalCount } from '@/features/agent-proposals';
import { usePendingSuggestionCount } from '@/features/suggestions';
import { hasPermission, type Workspace } from '@/features/workspaces';

export interface PendingReviewCounts {
  bySource: Record<ReviewSource, number>;
  total: number;
  /** Outside agents' proposals need `suggestions_view`; without it they are neither counted nor listed. */
  canViewProposals: boolean;
}

/** What waits for review in the workspace, by source and in all. */
export function usePendingReviewCounts(workspace: Workspace | undefined): PendingReviewCounts {
  const canViewProposals =
    workspace !== undefined && hasPermission(workspace, WorkspacePermission.suggestions_view);
  const suggestions = usePendingSuggestionCount(workspace?.id);
  const proposals = usePendingProposalCount(workspace?.id, canViewProposals);
  const visibleProposals = canViewProposals ? proposals : 0;
  return {
    bySource: {
      [ReviewSource.Suggestions]: suggestions,
      [ReviewSource.Proposals]: visibleProposals,
    },
    total: suggestions + visibleProposals,
    canViewProposals,
  };
}
