import { useSearchParams } from 'react-router';
import { ChannelType } from '@/api/schema';
import { ROUTE_QUERY } from '@/config/routes';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { parseEnum } from '@/lib/enum';
import type { StoreSetupRequest } from '../just-connected';

/**
 * The store just connected (`?setup=<channel>`, and `&setupStore=<id>` when the OAuth return
 * named it), and closing its setup.
 */
export function useStoreSetupParam(): { request: StoreSetupRequest | null; close: () => void } {
  const [params] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const channel = parseEnum(ChannelType, params.get(ROUTE_QUERY.storeSetup));
  return {
    request: channel
      ? { channel, connectionId: params.get(ROUTE_QUERY.storeSetupConnection) || null }
      : null,
    close: () =>
      updateParams((next) => {
        next.delete(ROUTE_QUERY.storeSetup);
        next.delete(ROUTE_QUERY.storeSetupConnection);
      }),
  };
}
