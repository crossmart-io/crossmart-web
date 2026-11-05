import { GOOGLE_COUNTRY_LABELS } from '../channels.constants';
import type { GoogleMerchantSettings } from '../channels.types';
import { AccountDetail } from './AccountDetail';

const NOT_SET = 'Not set';
const CLAIMED = 'claimed';
const NOT_CLAIMED = 'not claimed';

/** The Merchant Center account's id, website and the country it lists in. */
export function GoogleAccountDetails({ google }: { google: GoogleMerchantSettings }) {
  const website = google.homepageUri
    ? `${google.homepageUri} (${google.homepageClaimed ? CLAIMED : NOT_CLAIMED})`
    : NOT_SET;
  return (
    <>
      <AccountDetail label="Merchant Center ID">{google.accountId}</AccountDetail>
      <AccountDetail label="Website">{website}</AccountDetail>
      <AccountDetail label="Country">{GOOGLE_COUNTRY_LABELS[google.country]}</AccountDetail>
    </>
  );
}
