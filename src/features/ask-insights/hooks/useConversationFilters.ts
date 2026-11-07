import { useSearchParams } from 'react-router';
import { AskChannel, AskOutcome } from '@/api/schema';
import { ASK_INSIGHTS_ROUTE_QUERY } from '@/config/routes';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { parseEnum } from '@/lib/enum';
import { setOrDeleteParam } from '@/lib/search-params';
import { EscalatedFilter } from '../ask-insights.types';
import { type DayRangeFilter, useDayRangeFilter } from './useDayRangeFilter';

export interface ConversationFilters extends DayRangeFilter {
  outcome: AskOutcome | undefined;
  setOutcome: (outcome: AskOutcome | undefined) => void;
  channel: AskChannel | undefined;
  setChannel: (channel: AskChannel | undefined) => void;
  escalated: EscalatedFilter | undefined;
  setEscalated: (escalated: EscalatedFilter | undefined) => void;
  isFiltered: boolean;
  clearAll: () => void;
}

const FILTER_KEYS = [
  ASK_INSIGHTS_ROUTE_QUERY.outcome,
  ASK_INSIGHTS_ROUTE_QUERY.channel,
  ASK_INSIGHTS_ROUTE_QUERY.escalated,
  ASK_INSIGHTS_ROUTE_QUERY.from,
  ASK_INSIGHTS_ROUTE_QUERY.to,
] as const;

/** The conversations table's filters, in the URL so a filtered list can be linked to. */
export function useConversationFilters(): ConversationFilters {
  const [searchParams] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const dayRange = useDayRangeFilter();
  const read = (key: string) => searchParams.get(key);
  const set = (key: string, value: string | undefined) =>
    updateParams((params) => setOrDeleteParam(params, key, value ?? ''));
  const outcome = parseEnum(AskOutcome, read(ASK_INSIGHTS_ROUTE_QUERY.outcome));
  const channel = parseEnum(AskChannel, read(ASK_INSIGHTS_ROUTE_QUERY.channel));
  const escalated = parseEnum(EscalatedFilter, read(ASK_INSIGHTS_ROUTE_QUERY.escalated));
  return {
    ...dayRange,
    outcome,
    setOutcome: (next) => set(ASK_INSIGHTS_ROUTE_QUERY.outcome, next),
    channel,
    setChannel: (next) => set(ASK_INSIGHTS_ROUTE_QUERY.channel, next),
    escalated,
    setEscalated: (next) => set(ASK_INSIGHTS_ROUTE_QUERY.escalated, next),
    isFiltered: FILTER_KEYS.some((key) => searchParams.has(key)),
    clearAll: () =>
      updateParams((params) => {
        for (const key of FILTER_KEYS) params.delete(key);
      }),
  };
}
