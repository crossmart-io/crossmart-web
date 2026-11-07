import { useSearchParams } from 'react-router';
import { AskEscalationStatus } from '@/api/schema';
import { ASK_INSIGHTS_ROUTE_QUERY } from '@/config/routes';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { parseEnum } from '@/lib/enum';
import { setOrDeleteParam } from '@/lib/search-params';

/** The escalation list's status filter, in the URL so a filtered list can be linked to. */
export function useEscalationStatusFilter() {
  const [searchParams] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const status = parseEnum(AskEscalationStatus, searchParams.get(ASK_INSIGHTS_ROUTE_QUERY.status));
  const setStatus = (next: AskEscalationStatus | undefined) =>
    updateParams((params) => setOrDeleteParam(params, ASK_INSIGHTS_ROUTE_QUERY.status, next ?? ''));
  return { status, setStatus };
}
