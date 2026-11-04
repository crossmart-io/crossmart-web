import { ChannelConnectionStatus, WorkspacePermission } from '@/api/schema';
import type { Workspace } from '@/features/workspaces';
import { hasPermission } from '@/features/workspaces';
import { CHANNELS } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { useChannelConnections } from '../hooks/useChannelConnections';
import { ChannelCard } from './ChannelCard';
import { ConnectableChannelCard } from './ConnectableChannelCard';

const NO_CONNECTIONS: readonly ChannelConnection[] = [];

/** Every channel: connectable ones with their accounts, the rest with their roadmap status. */
export function ChannelGrid({ workspace }: { workspace: Workspace }) {
  const { data } = useChannelConnections(workspace.id);
  const active = (data ?? NO_CONNECTIONS).filter(
    (connection) => connection.status !== ChannelConnectionStatus.DISCONNECTED,
  );
  const canManage = hasPermission(workspace, WorkspacePermission.channels_manage);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CHANNELS.map((channel) =>
        channel.connect ? (
          <ConnectableChannelCard
            key={channel.name}
            workspaceId={workspace.id}
            channel={channel}
            connect={channel.connect}
            connections={active.filter(
              (connection) => connection.channel === channel.connect?.type,
            )}
            canManage={canManage}
          />
        ) : (
          <ChannelCard key={channel.name} channel={channel} />
        ),
      )}
    </div>
  );
}
