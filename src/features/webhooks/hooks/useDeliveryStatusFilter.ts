import { useSearchParams } from 'react-router';
import { WebhookDeliveryStatus } from '@/api/schema';
import { ROUTE_QUERY } from '@/config/routes';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { parseEnum } from '@/lib/enum';
import { setOrDeleteParam } from '@/lib/search-params';

/** The delivery log's status filter, in the URL so a filtered log can be linked to. */
export function useDeliveryStatusFilter() {
  const [searchParams] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const status = parseEnum(WebhookDeliveryStatus, searchParams.get(ROUTE_QUERY.status));
  const setStatus = (next: WebhookDeliveryStatus | undefined) =>
    updateParams((params) => setOrDeleteParam(params, ROUTE_QUERY.status, next ?? ''));
  return { status, setStatus };
}
