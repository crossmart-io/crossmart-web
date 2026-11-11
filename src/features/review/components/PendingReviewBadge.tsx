import { SidebarMenuBadge } from '@/components/ui/sidebar';
import { useCurrentWorkspace } from '@/features/workspaces';
import { usePendingReviewCounts } from '../hooks/usePendingReviewCounts';
import { REVIEW_COPY } from '../review.constants';

/** The Agent menu item's count: suggestions and proposals waiting for review, together. */
export function PendingReviewBadge() {
  const { workspace } = useCurrentWorkspace();
  const { total } = usePendingReviewCounts(workspace);
  if (total === 0) return null;
  return (
    <SidebarMenuBadge>
      {total}
      <span className="sr-only"> {REVIEW_COPY.pendingLabel(total)}</span>
    </SidebarMenuBadge>
  );
}
