const moneyFormats = new Map<string, Intl.NumberFormat>();
const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });
const DATE_TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

/** One formatter per currency: building an Intl formatter is far slower than using one. */
function moneyFormat(currency: string): Intl.NumberFormat {
  let format = moneyFormats.get(currency);
  if (!format) {
    format = new Intl.NumberFormat(undefined, { style: 'currency', currency });
    moneyFormats.set(currency, format);
  }
  return format;
}

/** Display only: amounts stay exact decimal strings everywhere else. */
export function formatMoney(amount: string, currency: string): string {
  return moneyFormat(currency).format(Number(amount));
}

/** Base 10, for turning a currency's minor units (cents) into whole units. */
const DECIMAL_BASE = 10;

/**
 * An amount in the currency's minor units, such as Stripe's cents: 2900 USD reads "$29.00".
 * The currency's own number of decimals decides the scale (none for JPY).
 */
export function formatMinorUnits(amount: number, currency: string): string {
  const format = moneyFormat(currency.toUpperCase());
  const decimals = format.resolvedOptions().maximumFractionDigits ?? 0;
  return format.format(amount / DECIMAL_BASE ** decimals);
}

/** Part types that are not the number itself: the symbol and the spaces around it. */
const CURRENCY_PART_TYPES = new Set<Intl.NumberFormatPartTypes>(['currency', 'literal']);

/**
 * The amount with the currency's decimals and grouping but no symbol, for inputs that show the
 * currency themselves: "47.93" for EUR, "1,200" for JPY.
 */
export function formatAmount(amount: string, currency: string): string {
  return moneyFormat(currency)
    .formatToParts(Number(amount))
    .filter((part) => !CURRENCY_PART_TYPES.has(part.type))
    .map((part) => part.value)
    .join('')
    .trim();
}

export function formatPriceRange(range: { min: string; max: string }, currency: string): string {
  const min = formatMoney(range.min, currency);
  return range.min === range.max ? min : `${min} – ${formatMoney(range.max, currency)}`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count.toLocaleString()} ${count === 1 ? singular : plural}`;
}

/** A calendar date in the user's locale, or `fallback` when there is none. */
export function formatDate(value: string | null | undefined, fallback = '—'): string {
  return value ? DATE_FORMAT.format(new Date(value)) : fallback;
}

/** A date and time of day in the user's locale, or `fallback` when there is none. */
export function formatDateTime(value: string | null | undefined, fallback = '—'): string {
  return value ? DATE_TIME_FORMAT.format(new Date(value)) : fallback;
}

/** The app's copy is English without a serial comma, which is how British English lists read. */
const COPY_LIST_LOCALE = 'en-GB';
const ALTERNATIVES_FORMAT = new Intl.ListFormat(COPY_LIST_LOCALE, { type: 'disjunction' });

/** Choices as they read in a sentence: "Shopify, eBay or Google". */
export function formatAlternatives(items: readonly string[]): string {
  return ALTERNATIVES_FORMAT.format(items);
}
