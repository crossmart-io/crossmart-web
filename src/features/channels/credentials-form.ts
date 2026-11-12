import { FalabellaCountry } from '@/api/schema';
import { parseEnum } from '@/lib/enum';
import type { CredentialFieldPrompt, SellerCredentials } from './channels.constants';

/** What the merchant typed, by field key. */
export type CredentialValues = Partial<Record<keyof SellerCredentials, string>>;

function valueOf(values: CredentialValues, key: keyof SellerCredentials): string {
  return values[key]?.trim() ?? '';
}

/** Whether every field has a value. */
export function isComplete(
  fields: readonly CredentialFieldPrompt[],
  values: CredentialValues,
): boolean {
  return fields.every((field) => valueOf(values, field.key).length > 0);
}

/** The credentials to send, trimmed; null until every field is filled with a valid value. */
export function toSellerCredentials(values: CredentialValues): SellerCredentials | null {
  const country = parseEnum(FalabellaCountry, valueOf(values, 'country'));
  const credentials = {
    sellerId: valueOf(values, 'sellerId'),
    userId: valueOf(values, 'userId'),
    apiKey: valueOf(values, 'apiKey'),
  };
  if (!country || Object.values(credentials).some((value) => value.length === 0)) return null;
  return { ...credentials, country };
}
