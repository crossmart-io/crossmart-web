import { z } from 'zod';
import { EbayCondition } from '@/api/schema';
import {
  CITY_MAX_LENGTH,
  COUNTRY_CODE_PATTERN,
  POSTAL_CODE_MAX_LENGTH,
} from './channels.constants';
import type { EbayListingDefaults, EbayListingDefaultsBody } from './channels.types';

/** Policies are picked by id; an empty string is "not chosen yet". */
export const ebayDefaultsFormSchema = z
  .object({
    fulfillmentPolicyId: z.string(),
    paymentPolicyId: z.string(),
    returnPolicyId: z.string(),
    condition: z.enum(EbayCondition),
    postalCode: z.string().trim().max(POSTAL_CODE_MAX_LENGTH),
    country: z.string().trim().toUpperCase(),
    city: z.string().trim().max(CITY_MAX_LENGTH),
  })
  .refine((values) => values.postalCode === '' || COUNTRY_CODE_PATTERN.test(values.country), {
    path: ['country'],
    message: 'Enter a two-letter country code, such as US',
  });

export type EbayDefaultsFormValues = z.input<typeof ebayDefaultsFormSchema>;
export type EbayDefaultsFormOutput = z.output<typeof ebayDefaultsFormSchema>;

/** The saved defaults as form values. */
export function toEbayDefaultsForm(defaults: EbayListingDefaults): EbayDefaultsFormValues {
  return {
    fulfillmentPolicyId: defaults.fulfillmentPolicyId ?? '',
    paymentPolicyId: defaults.paymentPolicyId ?? '',
    returnPolicyId: defaults.returnPolicyId ?? '',
    condition: defaults.condition,
    postalCode: defaults.location?.postalCode ?? '',
    country: defaults.location?.country ?? '',
    city: defaults.location?.city ?? '',
  };
}

function orNull(value: string): string | null {
  return value === '' ? null : value;
}

/** What the API saves; without a postal code there is no ship-from address. */
export function toEbayDefaultsBody(values: EbayDefaultsFormOutput): EbayListingDefaultsBody {
  return {
    fulfillmentPolicyId: orNull(values.fulfillmentPolicyId),
    paymentPolicyId: orNull(values.paymentPolicyId),
    returnPolicyId: orNull(values.returnPolicyId),
    condition: values.condition,
    location:
      values.postalCode === ''
        ? null
        : { postalCode: values.postalCode, country: values.country, city: orNull(values.city) },
  };
}
