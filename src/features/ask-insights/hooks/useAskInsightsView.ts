import { useSearchParams } from 'react-router';
import { ASK_INSIGHTS_ROUTE_QUERY } from '@/config/routes';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { parseEnum } from '@/lib/enum';
import { setOrDeleteParam } from '@/lib/search-params';
import { DEFAULT_ASK_INSIGHTS_VIEW } from '../ask-insights.constants';
import { AskInsightsView } from '../ask-insights.types';

/** The page's open section, in the URL; the default one keeps the URL clean. */
export function useAskInsightsView(): [AskInsightsView, (view: AskInsightsView) => void] {
  const [searchParams] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const view =
    parseEnum(AskInsightsView, searchParams.get(ASK_INSIGHTS_ROUTE_QUERY.view)) ??
    DEFAULT_ASK_INSIGHTS_VIEW;
  const setView = (next: AskInsightsView) =>
    updateParams((params) =>
      setOrDeleteParam(
        params,
        ASK_INSIGHTS_ROUTE_QUERY.view,
        next === DEFAULT_ASK_INSIGHTS_VIEW ? '' : next,
      ),
    );
  return [view, setView];
}
