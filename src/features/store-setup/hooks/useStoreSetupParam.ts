import { useSearchParams } from 'react-router';
import { ChannelType } from '@/api/schema';
import { ROUTE_QUERY } from '@/config/routes';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { parseEnum } from '@/lib/enum';

/** The channel a store was just connected on (`?setup=`), and closing its setup. */
export function useStoreSetupParam(): { channel: ChannelType | undefined; close: () => void } {
  const [params] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  return {
    channel: parseEnum(ChannelType, params.get(ROUTE_QUERY.storeSetup)),
    close: () => updateParams((next) => next.delete(ROUTE_QUERY.storeSetup)),
  };
}
