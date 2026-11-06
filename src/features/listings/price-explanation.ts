import { PriceStepKind } from '@/api/schema';
import { EXCHANGE_RATE_DISPLAY_DECIMALS } from './listings.constants';
import type { ResolvedPrice } from './listings.types';

/** The rate at the start of a conversion step's label: "× 0.887548 (USD → EUR)". */
const CONVERSION_RATE = /^(×\s*)(\d+(?:\.\d+)?)/;

/** Rates as the API writes them, in plain digits, shortened to the decimals worth reading. */
const RATE_FORMAT = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: EXCHANGE_RATE_DISPLAY_DECIMALS,
  useGrouping: false,
});

/** "× 0.887548 (USD → EUR)" as "× 0.8875 (USD → EUR)"; other labels as they are. */
function roundConversionLabel(label: string): string {
  return label.replace(
    CONVERSION_RATE,
    (_match, sign: string, rate: string) => `${sign}${RATE_FORMAT.format(Number(rate))}`,
  );
}

/**
 * How the price was reached, in the API's words, with its conversion rate rounded so the line
 * reads: "$64.00 → × 0.8875 (USD → EUR) = €56.80". The price itself is exact either way.
 */
export function readablePriceExplanation(price: ResolvedPrice): string {
  return price.steps
    .filter((step) => step.kind === PriceStepKind.conversion)
    .reduce(
      (explanation, step) => explanation.replace(step.label, roundConversionLabel(step.label)),
      price.explanation,
    );
}
