import { z } from 'zod';
import { GoogleTargetCountry } from '@/api/schema';
import {
  DEFAULT_PRODUCT_PATH,
  GOOGLE_SETUP_COPY,
  PRODUCT_URL_HANDLE_PLACEHOLDER,
} from './channels.constants';
import type { GoogleListingSetupBody, GoogleMerchantSettings } from './channels.types';

const HTTPS_PREFIX = 'https://';
const TRAILING_SLASH = /\/+$/;

export const googleSetupFormSchema = z.object({
  country: z.enum(GoogleTargetCountry),
  productUrlTemplate: z
    .string()
    .trim()
    .refine(
      (template) =>
        template.startsWith(HTTPS_PREFIX) &&
        template.includes(PRODUCT_URL_HANDLE_PLACEHOLDER) &&
        URL.canParse(template),
      { message: GOOGLE_SETUP_COPY.productUrlInvalid },
    ),
});

export type GoogleSetupFormValues = z.infer<typeof googleSetupFormSchema>;

/** The account's website with the usual product path, as a first suggestion. */
function suggestedTemplate(homepageUri: string | null): string {
  return homepageUri ? `${homepageUri.replace(TRAILING_SLASH, '')}${DEFAULT_PRODUCT_PATH}` : '';
}

/** The saved setup as form values, or the account's country and website before one is saved. */
export function toGoogleSetupForm(settings: GoogleMerchantSettings): GoogleSetupFormValues {
  return {
    country: settings.listingSetup?.country ?? settings.country,
    productUrlTemplate:
      settings.listingSetup?.productUrlTemplate ?? suggestedTemplate(settings.homepageUri),
  };
}

export function toGoogleSetupBody(values: GoogleSetupFormValues): GoogleListingSetupBody {
  return { country: values.country, productUrlTemplate: values.productUrlTemplate };
}
