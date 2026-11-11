import { ChannelConnectionStatus, ProductStatus, type ChannelType } from '@/api/schema';
import type { ChannelConnection } from '@/features/channels';
import type { ProductSelectionRule } from '@/features/listings/listings.types';
import { JUST_CONNECTED_WINDOW_MS } from './store-setup.constants';

function byNewest(first: ChannelConnection, second: ChannelConnection): number {
  return Date.parse(second.connectedAt) - Date.parse(first.connectedAt);
}

/** Whether the store adds no product on its own yet: no rule, or one switched off. */
function addsNothingAutomatically(connection: ChannelConnection): boolean {
  return connection.productSelection === null || connection.productSelection.filter === null;
}

/** Which store to offer the setup of: the OAuth return's channel, and its store when named. */
export interface StoreSetupRequest {
  channel: ChannelType;
  connectionId: string | null;
}

/** Whether a store is connected and adds no product on its own yet, so setup is worth offering. */
function needsSetup(connection: ChannelConnection): boolean {
  return (
    connection.status === ChannelConnectionStatus.CONNECTED && addsNothingAutomatically(connection)
  );
}

/**
 * The store to set up after an OAuth return. When the return names the store, it is that one
 * (a reconnect is flagged by the API and asks for no setup at all); an older API names only the
 * channel, and `justConnectedStore` finds it.
 */
export function storeToSetUp(
  connections: readonly ChannelConnection[],
  request: StoreSetupRequest,
  now: Date,
): ChannelConnection | undefined {
  if (!request.connectionId) return justConnectedStore(connections, request.channel, now);
  const named = connections.find((connection) => connection.id === request.connectionId);
  return named && needsSetup(named) ? named : undefined;
}

/**
 * The store the merchant just connected on `channel`, when it still needs setting up, for an
 * OAuth return that names only the channel: the newest connected store there, connected moments
 * ago and adding nothing automatically yet; a store reconnected later is left alone.
 */
export function justConnectedStore(
  connections: readonly ChannelConnection[],
  channel: ChannelType,
  now: Date,
): ChannelConnection | undefined {
  const [newest] = connections
    .filter((connection) => connection.channel === channel)
    .filter((connection) => connection.status === ChannelConnectionStatus.CONNECTED)
    .sort(byNewest);
  if (!newest) return undefined;
  const isRecent = now.getTime() - Date.parse(newest.connectedAt) <= JUST_CONNECTED_WINDOW_MS;
  return isRecent && addsNothingAutomatically(newest) ? newest : undefined;
}

/** The automatic rule that adds every active product, keeping the products picked by hand. */
export function activeProductsRule(current: ProductSelectionRule | null): ProductSelectionRule {
  return {
    filter: { status: ProductStatus.ACTIVE },
    includeProductIds: current?.includeProductIds ?? [],
    excludeProductIds: current?.excludeProductIds ?? [],
  };
}
