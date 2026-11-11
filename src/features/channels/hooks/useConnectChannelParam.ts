import { useSearchParams } from 'react-router';
import { ChannelType } from '@/api/schema';
import { ROUTE_QUERY } from '@/config/routes';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { parseEnum } from '@/lib/enum';

/**
 * The channel a link asks to connect (`?connect=<channel>`), and dropping the parameter once the
 * dialog closes, so a reload does not open it again.
 */
export function useConnectChannelParam(): { channel: ChannelType | null; clear: () => void } {
  const [params] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  return {
    channel: parseEnum(ChannelType, params.get(ROUTE_QUERY.connectChannel)) ?? null,
    clear: () => updateParams((next) => next.delete(ROUTE_QUERY.connectChannel)),
  };
}
