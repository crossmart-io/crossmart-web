import type { ChannelConnection } from '../channels.types';
import { AccountDetail } from './AccountDetail';

/** The store's domain, storefront, currency and stock location, as read from Shopify. */
export function ShopifyAccountDetails({ connection }: { connection: ChannelConnection }) {
  const shopify = connection.shopify;
  return (
    <>
      <AccountDetail label="Domain">{connection.externalAccountId}</AccountDetail>
      {shopify?.primaryDomainUrl && (
        <AccountDetail label="Storefront">
          <a
            href={shopify.primaryDomainUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            {shopify.primaryDomainUrl}
          </a>
        </AccountDetail>
      )}
      {shopify && <AccountDetail label="Currency">{shopify.currencyCode}</AccountDetail>}
      {shopify?.primaryLocation && (
        <AccountDetail label="Stock location">{shopify.primaryLocation.name}</AccountDetail>
      )}
    </>
  );
}
