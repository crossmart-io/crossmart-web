import type { ChannelConnection } from './channels.types';

/** What the merchant calls the store: its own name when the channel reports one. */
export function connectionName(connection: ChannelConnection): string {
  return connection.shopify?.shopName ?? connection.displayName;
}
