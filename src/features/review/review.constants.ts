import { ReviewSource } from '@/config/routes';
import type { FilterTab } from '@/components/lists/FilterTabs';

export const REVIEW_COPY = {
  pageName: 'Review',
  agentTitle: 'Agent',
  agentTab: 'Chat',
  tabsLabel: 'Agent views',
  sourcesLabel: 'Source',
  sources: {
    [ReviewSource.Suggestions]: 'AI suggestions',
    [ReviewSource.Proposals]: 'Outside agents',
  },
  pendingLabel: (count: number) => (count === 1 ? 'item to review' : 'items to review'),
} as const;

/** The review list's sources, AI suggestions first: every role sees them. */
export const REVIEW_SOURCE_TABS: readonly FilterTab<ReviewSource>[] = [
  { value: ReviewSource.Suggestions, label: REVIEW_COPY.sources[ReviewSource.Suggestions] },
  { value: ReviewSource.Proposals, label: REVIEW_COPY.sources[ReviewSource.Proposals] },
];
