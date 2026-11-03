import { ChannelConnectionStatus } from '@/api/schema';
import { pluralize } from '@/lib/format';
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

const SUMMARY_SEPARATOR = ' · ';

/** Problems the merchant should act on, as they read in a channel's summary. */
const ATTENTION_LABELS: Partial<Record<ChannelConnectionStatus, (count: number) => string>> = {
  [ChannelConnectionStatus.NEEDS_REAUTH]: (count) =>
    `${count} need${count === 1 ? 's' : ''} re-auth`,
  [ChannelConnectionStatus.ERROR]: (count) => `${count} with errors`,
};

/** One line for a channel's stores, however many: "3 stores connected · 1 needs re-auth". */
export function connectionsSummary(connections: readonly ChannelConnection[]): string {
  const parts = [`${pluralize(connections.length, 'store')} connected`];
  for (const [status, label] of Object.entries(ATTENTION_LABELS)) {
    const count = connections.filter((connection) => connection.status === status).length;
    if (count > 0) parts.push(label(count));
  }
  return parts.join(SUMMARY_SEPARATOR);
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
