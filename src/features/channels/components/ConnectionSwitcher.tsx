import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChannelConnectionStatus } from '@/api/schema';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toChannelConnectionRoute } from '@/config/routes';
import { channelInfoFor } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { connectionName } from '../connection-name';
import { useChannelConnections } from '../hooks/useChannelConnections';
import { ConnectChannelDialog } from './ConnectChannelDialog';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';

interface ConnectionSwitcherProps {
  workspaceId: string;
  connection: ChannelConnection;
  /** The tab to open on the store switched to, so the merchant stays where they are. */
  tab: string;
  canManage: boolean;
}

/** The stores of the same channel, to switch between, and connecting another one. */
function useSiblingConnections(workspaceId: string, connection: ChannelConnection) {
  const { data } = useChannelConnections(workspaceId);
  const siblings = (data ?? []).filter(
    (candidate) =>
      candidate.channel === connection.channel &&
      candidate.status !== ChannelConnectionStatus.DISCONNECTED,
  );
  return siblings.some((candidate) => candidate.id === connection.id)
    ? siblings
    : [connection, ...siblings];
}

interface StoreMenuItemProps {
  connection: ChannelConnection;
  isCurrent: boolean;
  onSelect: () => void;
}

function StoreMenuItem({ connection, isCurrent, onSelect }: StoreMenuItemProps) {
  return (
    <DropdownMenuItem onSelect={onSelect}>
      <Check className={isCurrent ? undefined : 'invisible'} aria-hidden="true" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">{connectionName(connection)}</span>
        <span className="truncate text-xs text-muted-foreground">
          {connection.externalAccountId}
        </span>
      </span>
      <ConnectionStatusBadge status={connection.status} />
    </DropdownMenuItem>
  );
}

/** The page title of a connection: its name, opening a menu of the channel's other stores. */
export function ConnectionSwitcher({
  workspaceId,
  connection,
  tab,
  canManage,
}: ConnectionSwitcherProps) {
  const navigate = useNavigate();
  const [isConnecting, setConnecting] = useState(false);
  const connections = useSiblingConnections(workspaceId, connection);
  const channel = channelInfoFor(connection.channel);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="-ml-2 h-auto max-w-full min-w-0 px-2 py-1 font-heading text-2xl font-semibold tracking-tight"
          >
            <span className="sr-only">Switch store, current store: </span>
            <span className="truncate">{connectionName(connection)}</span>
            <ChevronsUpDown className="size-5 text-muted-foreground" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-72">
          <DropdownMenuLabel>{channel?.name ?? 'Stores'}</DropdownMenuLabel>
          {connections.map((candidate) => (
            <StoreMenuItem
              key={candidate.id}
              connection={candidate}
              isCurrent={candidate.id === connection.id}
              onSelect={() => void navigate(toChannelConnectionRoute(candidate.id, tab))}
            />
          ))}
          {canManage && channel?.connect && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setConnecting(true)}>
                <Plus aria-hidden="true" />
                Connect another store
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {channel?.connect && (
        <ConnectChannelDialog
          workspaceId={workspaceId}
          channel={channel}
          connect={channel.connect}
          open={isConnecting}
          onOpenChange={setConnecting}
        />
      )}
    </>
  );
}
