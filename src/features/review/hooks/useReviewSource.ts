import { useSearchParams } from 'react-router';
import { ReviewSource, ROUTE_QUERY } from '@/config/routes';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { parseEnum } from '@/lib/enum';

/**
 * The review list's source, kept in the URL (`?source=`). AI suggestions when absent, or when
 * the role may not see outside agents' proposals. A new source starts on its own first tab.
 */
export function useReviewSource(
  canViewProposals: boolean,
): [ReviewSource, (source: ReviewSource) => void] {
  const [searchParams] = useSearchParams();
  const update = useSearchParamsUpdater();
  const requested = parseEnum(ReviewSource, searchParams.get(ROUTE_QUERY.reviewSource));
  const source =
    requested === ReviewSource.Proposals && !canViewProposals
      ? ReviewSource.Suggestions
      : (requested ?? ReviewSource.Suggestions);
  const setSource = (next: ReviewSource) =>
    update((params) => {
      params.set(ROUTE_QUERY.reviewSource, next);
      params.delete(ROUTE_QUERY.status);
    });
  return [source, setSource];
}
