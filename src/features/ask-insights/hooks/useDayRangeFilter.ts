import { useSearchParams } from 'react-router';
import { ASK_INSIGHTS_ROUTE_QUERY } from '@/config/routes';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { setOrDeleteParam } from '@/lib/search-params';
import type { DayRange } from '../ask-insights.types';

export interface DayRangeFilter {
  range: DayRange;
  setFrom: (day: string) => void;
  setTo: (day: string) => void;
}

/** The period the conversations and question lists cover, as two days in the URL. */
export function useDayRangeFilter(): DayRangeFilter {
  const [searchParams] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const set = (key: string, day: string) =>
    updateParams((params) => setOrDeleteParam(params, key, day));
  return {
    range: {
      from: searchParams.get(ASK_INSIGHTS_ROUTE_QUERY.from) ?? undefined,
      to: searchParams.get(ASK_INSIGHTS_ROUTE_QUERY.to) ?? undefined,
    },
    setFrom: (day) => set(ASK_INSIGHTS_ROUTE_QUERY.from, day),
    setTo: (day) => set(ASK_INSIGHTS_ROUTE_QUERY.to, day),
  };
}
