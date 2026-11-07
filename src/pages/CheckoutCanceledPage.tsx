import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { BILLING_COPY, CheckoutCanceled } from '@/features/billing';

export function CheckoutCanceledPage() {
  return (
    <Page name={BILLING_COPY.checkoutCanceledTitle} parents={PAGE_PARENTS.billing}>
      <CheckoutCanceled />
    </Page>
  );
}
