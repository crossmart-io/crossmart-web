import { RouteTabs, type RouteTab } from '@/components/navigation/RouteTabs';
import { ROUTES } from '@/config/routes';
import type { Workspace } from '@/features/workspaces';
import { usePendingReviewCounts } from '../hooks/usePendingReviewCounts';
import { REVIEW_COPY } from '../review.constants';

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="rounded-full bg-brand px-1.5 text-[11px] leading-4 font-semibold text-white tabular-nums">
      {count}
      <span className="sr-only"> {REVIEW_COPY.pendingLabel(count)}</span>
    </span>
  );
}

/** Crossmart Agent's two views: the chat with its live map, and what waits for review. */
export function AgentTabs({ workspace }: { workspace: Workspace | undefined }) {
  const { total } = usePendingReviewCounts(workspace);
  const tabs: RouteTab[] = [
    { label: REVIEW_COPY.agentTab, to: ROUTES.agent, exact: true },
    { label: REVIEW_COPY.pageName, to: ROUTES.agentReview, badge: <CountBadge count={total} /> },
  ];
  return <RouteTabs tabs={tabs} label={REVIEW_COPY.tabsLabel} />;
}
