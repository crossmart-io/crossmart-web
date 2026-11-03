import { ChannelConnectionStatus } from '@/api/schema';
import type { ChannelConnection } from './channels.types';

/** Most urgent first: a card shows the status that most needs the merchant's attention. */
const STATUS_URGENCY: readonly ChannelConnectionStatus[] = [
  ChannelConnectionStatus.ERROR,
  ChannelConnectionStatus.NEEDS_REAUTH,
  ChannelConnectionStatus.CONNECTED,
  ChannelConnectionStatus.DISCONNECTED,
];

/** The status a channel card shows for its connections, or undefined when it has none. */
export function headlineStatus(
  connections: readonly ChannelConnection[],
): ChannelConnectionStatus | undefined {
  return STATUS_URGENCY.find((status) =>
    connections.some((connection) => connection.status === status),
  );
}

/** How far the workspace is with channels, for onboarding. */
export enum ChannelSetup {
  NotConnected = 'not_connected',
  /** A store is connected, but its products were never imported. */
  Connected = 'connected',
  Imported = 'imported',
}

export function channelSetupOf(connections: readonly ChannelConnection[]): ChannelSetup {
  const connected = connections.filter(
    (connection) => connection.status === ChannelConnectionStatus.CONNECTED,
  );
  if (connected.length === 0) return ChannelSetup.NotConnected;
  return connected.some((connection) => connection.lastSyncedAt !== null)
    ? ChannelSetup.Imported
    : ChannelSetup.Connected;
}
