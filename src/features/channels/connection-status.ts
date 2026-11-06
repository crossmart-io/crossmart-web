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

/** What a store's status asks of the merchant, as a verb for one store and for several. */
interface AttentionVerb {
  singular: string;
  plural: string;
}

/** Problems the merchant should act on, as they read in a channel's summary. */
const ATTENTION_VERBS: Partial<Record<ChannelConnectionStatus, AttentionVerb>> = {
  [ChannelConnectionStatus.NEEDS_REAUTH]: {
    singular: 'needs reconnecting',
    plural: 'need reconnecting',
  },
  [ChannelConnectionStatus.ERROR]: { singular: 'has errors', plural: 'have errors' },
};

/** Whether the store cannot sync until the merchant reconnects it. */
export function needsReconnect(status: ChannelConnectionStatus): boolean {
  return status !== ChannelConnectionStatus.CONNECTED;
}

/** Listings whose last sync failed, across the stores. */
export function totalFailedListings(connections: readonly ChannelConnection[]): number {
  return connections.reduce((sum, connection) => sum + connection.failedListings, 0);
}

/** "1 of 2 stores needs reconnecting", or "The store needs reconnecting" when there is one. */
function attentionPart(count: number, total: number, verb: AttentionVerb, isFirst: boolean) {
  const action = count === 1 ? verb.singular : verb.plural;
  if (total === 1) return `The store ${action}`;
  return isFirst ? `${count} of ${total} stores ${action}` : `${count} ${action}`;
}

/** The stores that need the merchant, one part per problem, most urgent first. */
function attentionParts(connections: readonly ChannelConnection[]): string[] {
  const parts: string[] = [];
  for (const [status, verb] of Object.entries(ATTENTION_VERBS)) {
    const count = connections.filter((connection) => connection.status === status).length;
    if (count > 0) parts.push(attentionPart(count, connections.length, verb, parts.length === 0));
  }
  return parts;
}

/** One line for a channel's stores: "3 stores connected", or "1 of 2 stores needs reconnecting". */
export function connectionsSummary(connections: readonly ChannelConnection[]): string {
  const attention = attentionParts(connections);
  const parts =
    attention.length > 0 ? attention : [`${pluralize(connections.length, 'store')} connected`];
  const failed = totalFailedListings(connections);
  if (failed > 0) parts.push(pluralize(failed, 'listing error'));
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
