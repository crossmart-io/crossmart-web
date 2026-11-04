import type { ChannelConnection } from './channels.types';

/**
 * What to prefill when the merchant connects the account again: the eBay marketplace, since
 * an eBay connection is named `{userId}:{marketplace}`, else the account id (a store domain).
 */
export function reconnectAccountHandle(connection: ChannelConnection): string {
  return connection.ebay?.marketplaceId ?? connection.externalAccountId;
}

/** The currency the account sells in, when its channel reports one. */
export function connectionCurrency(connection: ChannelConnection): string | undefined {
  return connection.shopify?.currencyCode ?? connection.ebay?.currencyCode;
}
