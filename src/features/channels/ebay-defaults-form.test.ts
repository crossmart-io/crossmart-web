import { EbayCondition } from '@/api/schema';
import {
  ebayDefaultsFormSchema,
  toEbayDefaultsBody,
  toEbayDefaultsForm,
} from './ebay-defaults-form';

const DEFAULTS = {
  fulfillmentPolicyId: 'f-1',
  paymentPolicyId: null,
  returnPolicyId: 'r-1',
  condition: EbayCondition.USED_GOOD,
  location: { postalCode: '95125', country: 'US', city: null },
  merchantLocationKey: 'crossmart-default',
};

describe('eBay listing defaults form', () => {
  it('round-trips the saved defaults', () => {
    const values = ebayDefaultsFormSchema.parse(toEbayDefaultsForm(DEFAULTS));

    expect(toEbayDefaultsBody(values)).toEqual({
      fulfillmentPolicyId: 'f-1',
      paymentPolicyId: null,
      returnPolicyId: 'r-1',
      condition: EbayCondition.USED_GOOD,
      location: { postalCode: '95125', country: 'US', city: null },
    });
  });

  it('sends no address without a postal code, and upper-cases the country', () => {
    const empty = { ...toEbayDefaultsForm(DEFAULTS), postalCode: ' ', country: '' };
    const lower = { ...toEbayDefaultsForm(DEFAULTS), country: 'gb', city: ' London ' };

    expect(toEbayDefaultsBody(ebayDefaultsFormSchema.parse(empty)).location).toBeNull();
    expect(toEbayDefaultsBody(ebayDefaultsFormSchema.parse(lower)).location).toEqual({
      postalCode: '95125',
      country: 'GB',
      city: 'London',
    });
  });

  it('needs a two-letter country with a postal code', () => {
    const result = ebayDefaultsFormSchema.safeParse({
      ...toEbayDefaultsForm(DEFAULTS),
      country: 'USA',
    });

    expect(result.success).toBe(false);
  });
});
