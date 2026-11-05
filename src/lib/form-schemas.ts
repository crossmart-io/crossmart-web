import { z } from 'zod';

/** Mirrors the API's money columns: up to 10 integer digits and 2 decimals. */
const AMOUNT_PATTERN = /^\d{1,10}(\.\d{1,2})?$/;
const SIGNED_AMOUNT_PATTERN = /^-?\d{1,10}(\.\d{1,2})?$/;
/** Stock counts the API accepts: up to 7 digits. */
const COUNT_PATTERN = /^\d{1,7}$/;

const FORM_SCHEMA_MESSAGES = {
  amount: 'Enter an amount like 19.90',
  signedAmount: 'Enter a number with at most two decimals',
  count: 'Enter a whole number',
} as const;

/** A text field that may be left empty, and otherwise must match `pattern`. */
function optionalMatching(pattern: RegExp, message: string) {
  return z
    .string()
    .trim()
    .refine((value) => value === '' || pattern.test(value), message);
}

/** A price or cost, as typed: "19.90". */
export const moneyAmount = z.string().trim().regex(AMOUNT_PATTERN, FORM_SCHEMA_MESSAGES.amount);

/** A price or cost the merchant may leave empty. */
export const optionalMoneyAmount = optionalMatching(AMOUNT_PATTERN, FORM_SCHEMA_MESSAGES.amount);

/** An amount that may be negative, such as a price adjustment: "-2.50". */
export const signedAmount = z
  .string()
  .trim()
  .regex(SIGNED_AMOUNT_PATTERN, FORM_SCHEMA_MESSAGES.signedAmount);

/** A number of units the merchant may leave empty. */
export const optionalCount = optionalMatching(COUNT_PATTERN, FORM_SCHEMA_MESSAGES.count);
