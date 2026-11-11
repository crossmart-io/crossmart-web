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

/**
 * The store the merchant just connected on `channel`, when it still needs setting up. The OAuth
 * return names only the channel, so it is the newest connected store there, connected moments
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
