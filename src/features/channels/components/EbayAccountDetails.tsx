import type { components } from '@/api/schema';
import {
  EBAY_MARKETPLACE_LABELS,
  EBAY_POLICIES_COPY,
  EBAY_POLICY_KIND_LABELS,
} from '../channels.constants';
import { AccountDetail } from './AccountDetail';

type EbaySettings = components['schemas']['EbaySettingsDto'];

/** How many policies of each kind the account has, such as "2 shipping · 1 payment · 1 return". */
function policyCounts({ policies }: EbaySettings): string {
  return [
    `${policies.fulfillment.length} ${EBAY_POLICY_KIND_LABELS.fulfillment}`,
    `${policies.payment.length} ${EBAY_POLICY_KIND_LABELS.payment}`,
    `${policies.return.length} ${EBAY_POLICY_KIND_LABELS.return}`,
  ].join(EBAY_POLICIES_COPY.separator);
}

/** The eBay account's username, marketplace, currency and business policies. */
export function EbayAccountDetails({ ebay }: { ebay: EbaySettings }) {
  return (
    <>
      <AccountDetail label="eBay username">{ebay.username}</AccountDetail>
      <AccountDetail label="Marketplace">
        {EBAY_MARKETPLACE_LABELS[ebay.marketplaceId]}
      </AccountDetail>
      <AccountDetail label="Currency">{ebay.currencyCode}</AccountDetail>
      <AccountDetail label={EBAY_POLICIES_COPY.label}>
        {ebay.businessPoliciesEnabled ? policyCounts(ebay) : EBAY_POLICIES_COPY.off}
      </AccountDetail>
    </>
  );
}
