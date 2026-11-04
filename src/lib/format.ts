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
