import { api } from '@/api/client';
import { CHANNEL_CONNECTION_ENDPOINT } from '../listings.constants';

export function useChannelConnection(workspaceId: string, connectionId: string) {
  return api.useQuery('get', CHANNEL_CONNECTION_ENDPOINT, {
    params: { path: { workspaceId, connectionId } },
  });
}
