/** Display only: amounts stay exact decimal strings everywhere else. */
export function formatMoney(amount: string, currency: string): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(amount));
}

export function formatPriceRange(range: { min: string; max: string }, currency: string): string {
  const min = formatMoney(range.min, currency);
  return range.min === range.max ? min : `${min} – ${formatMoney(range.max, currency)}`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count.toLocaleString()} ${count === 1 ? singular : plural}`;
}
