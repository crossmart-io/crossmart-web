import { WorkspacePermission } from '@/api/schema';
import { ReviewSource } from '@/config/routes';
import { useAttentionCounts } from '@/features/attention';
import { hasPermission, type Workspace } from '@/features/workspaces';

export interface PendingReviewCounts {
  bySource: Record<ReviewSource, number>;
  total: number;
  /** Outside agents' proposals need `suggestions_view`; without it they are neither counted nor listed. */
  canViewProposals: boolean;
}

/**
 * What waits for review in the workspace, by source and in all. Read from the attention summary,
 * so the Agent badge, the Review tab and Home always show the same numbers.
 */
export function usePendingReviewCounts(workspace: Workspace | undefined): PendingReviewCounts {
  const canViewProposals =
    workspace !== undefined && hasPermission(workspace, WorkspacePermission.suggestions_view);
  const counts = useAttentionCounts(workspace?.id);
  const proposals = canViewProposals ? counts.proposals : 0;
  return {
    bySource: {
      [ReviewSource.Suggestions]: counts.suggestions,
      [ReviewSource.Proposals]: proposals,
    },
    total: counts.suggestions + proposals,
    canViewProposals,
  };
}
