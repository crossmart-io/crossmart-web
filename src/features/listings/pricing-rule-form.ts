import { z } from 'zod';
import { CompareAtMode, PriceRounding } from '@/api/schema';
import { signedAmount } from '@/lib/form-schemas';
import {
  PRICING_MAX_MARGIN_PERCENT,
  RateMode,
  PRICING_MAX_PERCENT,
  PRICING_MIN_PERCENT,
} from './listings.constants';
import type { PricingRule } from './listings.types';

const EXCHANGE_RATE = /^\d{1,9}(\.\d{1,6})?$/;
const EXCHANGE_RATE_MESSAGE = 'Enter a rate above zero with at most six decimals';

function decimalBetween(min: number, max: number) {
  return signedAmount.refine(
    (value) => Number(value) >= min && Number(value) <= max,
    `Between ${min} and ${max}`,
  );
}

/**
 * The pricing rule as the form edits it: text fields, the floor as an on/off switch, and the
 * conversion rate as a choice between the daily rate and a fixed one.
 */
export const pricingRuleFormSchema = z
  .object({
    adjustmentPercent: decimalBetween(PRICING_MIN_PERCENT, PRICING_MAX_PERCENT),
    fixedAmount: signedAmount,
    rounding: z.enum(PriceRounding),
    floorEnabled: z.boolean(),
    minMarginPercent: decimalBetween(0, PRICING_MAX_MARGIN_PERCENT),
    compareAt: z.enum(CompareAtMode),
    rateMode: z.enum(RateMode),
    fixedExchangeRate: z.string().trim(),
  })
  .superRefine((values, context) => {
    const rate = values.fixedExchangeRate;
    if (values.rateMode === RateMode.Fixed && (!EXCHANGE_RATE.test(rate) || Number(rate) <= 0)) {
      context.addIssue({
        code: 'custom',
        path: ['fixedExchangeRate'],
        message: EXCHANGE_RATE_MESSAGE,
      });
    }
  });

export type PricingRuleFormValues = z.infer<typeof pricingRuleFormSchema>;

const DEFAULT_MARGIN_PERCENT = '20';

/** A rule that leaves prices as they are: where the form starts without one. */
const NEUTRAL_RULE: PricingRule = {
  adjustmentPercent: '0',
  fixedAmount: '0',
  rounding: PriceRounding.none,
  floor: null,
  compareAt: CompareAtMode.adjust,
};

export function toPricingRuleForm(rule: PricingRule | null | undefined): PricingRuleFormValues {
  const source = rule ?? NEUTRAL_RULE;
  return {
    adjustmentPercent: source.adjustmentPercent,
    fixedAmount: source.fixedAmount,
    rounding: source.rounding,
    floorEnabled: source.floor !== null,
    minMarginPercent: source.floor?.minMarginPercent ?? DEFAULT_MARGIN_PERCENT,
    compareAt: source.compareAt,
    rateMode: source.fixedExchangeRate ? RateMode.Fixed : RateMode.Daily,
    fixedExchangeRate: source.fixedExchangeRate ?? '',
  };
}

export function toPricingRule(values: PricingRuleFormValues): PricingRule {
  return {
    adjustmentPercent: values.adjustmentPercent.trim(),
    fixedAmount: values.fixedAmount.trim(),
    rounding: values.rounding,
    floor: values.floorEnabled ? { minMarginPercent: values.minMarginPercent.trim() } : null,
    compareAt: values.compareAt,
    fixedExchangeRate: values.rateMode === RateMode.Fixed ? values.fixedExchangeRate.trim() : null,
  };
}

/** The rule to preview while typing: null until the form is valid. */
export function toPreviewRule(values: PricingRuleFormValues): PricingRule | null {
  const parsed = pricingRuleFormSchema.safeParse(values);
  return parsed.success ? toPricingRule(parsed.data) : null;
}
