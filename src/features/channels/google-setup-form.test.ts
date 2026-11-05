import { GoogleTargetCountry } from '@/api/schema';
import type { GoogleMerchantSettings } from './channels.types';
import { googleSetupFormSchema, toGoogleSetupForm } from './google-setup-form';

const ACCOUNT: GoogleMerchantSettings = {
  accountId: '123456789',
  accountName: 'Acme Goods',
  homepageUri: 'https://acme.example/',
  homepageClaimed: true,
  country: GoogleTargetCountry.DE,
  currencyCode: 'EUR',
  contentLanguage: 'de',
  listingSetup: null,
  readyToList: false,
};

describe('toGoogleSetupForm', () => {
  it('suggests the account’s country and its website’s product pages before a setup is saved', () => {
    expect(toGoogleSetupForm(ACCOUNT)).toEqual({
      country: GoogleTargetCountry.DE,
      productUrlTemplate: 'https://acme.example/products/{handle}',
    });
  });

  it('starts from the saved setup', () => {
    const saved = {
      ...ACCOUNT,
      listingSetup: {
        country: GoogleTargetCountry.FR,
        productUrlTemplate: 'https://acme.example/p/{handle}',
        dataSourceId: 'ds-1',
      },
    };

    expect(toGoogleSetupForm(saved)).toEqual({
      country: GoogleTargetCountry.FR,
      productUrlTemplate: 'https://acme.example/p/{handle}',
    });
  });
});

describe('googleSetupFormSchema', () => {
  it.each([
    'https://acme.example/products',
    'http://acme.example/products/{handle}',
    'acme.example/{handle}',
  ])('refuses %s', (productUrlTemplate) => {
    expect(
      googleSetupFormSchema.safeParse({ country: GoogleTargetCountry.US, productUrlTemplate })
        .success,
    ).toBe(false);
  });

  it('accepts an https address with {handle}', () => {
    expect(
      googleSetupFormSchema.safeParse({
        country: GoogleTargetCountry.US,
        productUrlTemplate: ' https://acme.example/products/{handle} ',
      }).data?.productUrlTemplate,
    ).toBe('https://acme.example/products/{handle}');
  });
});
