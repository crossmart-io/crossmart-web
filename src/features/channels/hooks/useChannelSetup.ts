import { type ChannelSetup, channelSetupOf } from '../connection-status';
import { useChannelConnections } from './useChannelConnections';

/** How far the workspace is with channels; undefined until the connections are loaded. */
export function useChannelSetup(workspaceId: string): ChannelSetup | undefined {
  const { data } = useChannelConnections(workspaceId);
  return data ? channelSetupOf(data) : undefined;
}
