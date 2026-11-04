/** The browser's own zone, such as "Asia/Jerusalem". */
export function browserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/** Every IANA zone the browser knows, for pickers; UTC first. */
export function timeZoneChoices(): string[] {
  return ['UTC', ...Intl.supportedValuesOf('timeZone').filter((zone) => zone !== 'UTC')];
}
