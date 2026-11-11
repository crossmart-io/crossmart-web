import { ReviewSource } from '@/config/routes';
import { FilterTabs } from '@/components/lists/FilterTabs';
import { AgentProposalsInbox } from '@/features/agent-proposals';
import { SuggestionsInbox } from '@/features/suggestions';
import type { Workspace } from '@/features/workspaces';
import { usePendingReviewCounts } from '../hooks/usePendingReviewCounts';
import { useReviewSource } from '../hooks/useReviewSource';
import { REVIEW_COPY, REVIEW_SOURCE_TABS } from '../review.constants';

/**
 * Everything waiting for the seller in one list: AI suggestions and, for roles that may see
 * them, outside agents' proposals, picked by source.
 */
export function ReviewInbox({ workspace }: { workspace: Workspace }) {
  const counts = usePendingReviewCounts(workspace);
  const [source, setSource] = useReviewSource(counts.canViewProposals);
  return (
    <div className="flex flex-col gap-4">
      {counts.canViewProposals && (
        <FilterTabs
          tabs={REVIEW_SOURCE_TABS}
          value={source}
          onChange={setSource}
          counts={counts.bySource}
          label={REVIEW_COPY.sourcesLabel}
        />
      )}
      {source === ReviewSource.Proposals ? (
        <AgentProposalsInbox workspace={workspace} />
      ) : (
        <SuggestionsInbox workspace={workspace} />
      )}
    </div>
  );
}
