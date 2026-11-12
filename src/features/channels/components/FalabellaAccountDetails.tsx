import { FALABELLA_COUNTRY_LABELS } from '../channels.constants';
import type { FalabellaSettings } from '../channels.types';
import { AccountDetail } from './AccountDetail';

/** The Falabella seller, the Seller Center user whose key is used, and the country. */
export function FalabellaAccountDetails({ falabella }: { falabella: FalabellaSettings }) {
  return (
    <>
      <AccountDetail label="Seller ID">{falabella.sellerId}</AccountDetail>
      <AccountDetail label="User ID">{falabella.userId}</AccountDetail>
      <AccountDetail label="Country">
        {FALABELLA_COUNTRY_LABELS[falabella.country]} ({falabella.currencyCode})
      </AccountDetail>
    </>
  );
}
