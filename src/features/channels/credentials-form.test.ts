import { FalabellaCountry } from '@/api/schema';
import { CredentialFieldKind } from './channels.constants';
import { isComplete, toSellerCredentials } from './credentials-form';

const FILLED = {
  sellerId: ' SC478FA ',
  userId: 'me@shop.cl',
  apiKey: ' key ',
  country: FalabellaCountry.fape,
};

describe('credentials form', () => {
  it('sends the values trimmed, with the country as Falabella names it', () => {
    expect(toSellerCredentials(FILLED)).toEqual({
      sellerId: 'SC478FA',
      userId: 'me@shop.cl',
      apiKey: 'key',
      country: FalabellaCountry.fape,
    });
  });

  it('sends nothing until every value is there and the country is known', () => {
    expect(toSellerCredentials({ ...FILLED, apiKey: '  ' })).toBeNull();
    expect(toSellerCredentials({ ...FILLED, country: 'famx' })).toBeNull();
  });

  it('is complete once each field has a value', () => {
    const fields = [
      { key: 'sellerId' as const, label: 'Seller ID', kind: CredentialFieldKind.Text },
      { key: 'apiKey' as const, label: 'API key', kind: CredentialFieldKind.Secret },
    ];
    expect(isComplete(fields, { sellerId: 'S' })).toBe(false);
    expect(isComplete(fields, { sellerId: 'S', apiKey: 'k' })).toBe(true);
  });
});
