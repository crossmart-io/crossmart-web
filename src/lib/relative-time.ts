const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const DAYS_PER_YEAR = 365;
/** Month and day in a day key are zero-padded to two digits. */
const DAY_KEY_PART_LENGTH = 2;

const SECOND_MS = MS_PER_SECOND;
const MINUTE_MS = SECOND_MS * SECONDS_PER_MINUTE;
const HOUR_MS = MINUTE_MS * MINUTES_PER_HOUR;
const DAY_MS = HOUR_MS * HOURS_PER_DAY;

/** Largest unit first: the first one the elapsed time fills is the one shown. */
const RELATIVE_UNITS: readonly { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: 'year', ms: DAY_MS * DAYS_PER_YEAR },
  { unit: 'month', ms: DAY_MS * DAYS_PER_MONTH },
  { unit: 'week', ms: DAY_MS * DAYS_PER_WEEK },
  { unit: 'day', ms: DAY_MS },
  { unit: 'hour', ms: HOUR_MS },
  { unit: 'minute', ms: MINUTE_MS },
  { unit: 'second', ms: SECOND_MS },
];

const RELATIVE_FORMAT = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
const DATE_TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});
const DAY_FORMAT = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});
const DAY_WITH_YEAR_FORMAT = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

/** "5 minutes ago", "yesterday", in the user's language. */
export function formatRelativeTime(value: string | Date, now = new Date()): string {
  const elapsedMs = new Date(value).getTime() - now.getTime();
  const match = RELATIVE_UNITS.find(({ ms }) => Math.abs(elapsedMs) >= ms) ?? RELATIVE_UNITS.at(-1);
  const unit = match?.unit ?? 'second';
  const ms = match?.ms ?? SECOND_MS;
  return RELATIVE_FORMAT.format(Math.round(elapsedMs / ms), unit);
}

/** The exact moment, for a tooltip next to a relative time. */
export function formatDateTime(value: string | Date): string {
  return DATE_TIME_FORMAT.format(new Date(value));
}

/** A local calendar day, as a stable key for grouping ("2026-11-02"). */
export function toLocalDayKey(value: string | Date): string {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(DAY_KEY_PART_LENGTH, '0');
  const day = String(date.getDate()).padStart(DAY_KEY_PART_LENGTH, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** "Today", "Yesterday", "Monday, November 2", or with the year when it is not this one. */
export function formatDayHeading(value: string | Date, now = new Date()): string {
  const date = new Date(value);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (toLocalDayKey(date) === toLocalDayKey(now))
    return capitalize(RELATIVE_FORMAT.format(0, 'day'));
  if (toLocalDayKey(date) === toLocalDayKey(yesterday)) {
    return capitalize(RELATIVE_FORMAT.format(-1, 'day'));
  }
  const format = date.getFullYear() === now.getFullYear() ? DAY_FORMAT : DAY_WITH_YEAR_FORMAT;
  return format.format(date);
}

function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}
