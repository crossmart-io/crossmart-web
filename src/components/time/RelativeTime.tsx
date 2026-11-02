import { formatDateTime, formatRelativeTime } from '@/lib/relative-time';

/** "5 minutes ago", with the exact time on hover and for assistive technology. */
export function RelativeTime({ value, className }: { value: string; className?: string }) {
  const exact = formatDateTime(value);
  return (
    <time dateTime={value} title={exact} aria-label={exact} className={className}>
      {formatRelativeTime(value)}
    </time>
  );
}
