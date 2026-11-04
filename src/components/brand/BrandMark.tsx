import { cn } from 'cn';

const MARK_INK = '#111111';
const MARK_BLUE = '#1a4be0';

/** The Crossmart "one to many" mark: one source fanning out to three channels. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn('size-6 shrink-0', className)}>
      <g strokeWidth="7" strokeLinecap="round">
        <line x1="12" y1="24" x2="42" y2="8" stroke={MARK_INK} />
        <line x1="12" y1="24" x2="42" y2="40" stroke={MARK_INK} />
        <line x1="12" y1="24" x2="43" y2="24" stroke={MARK_BLUE} />
      </g>
      <circle cx="11" cy="24" r="8" fill={MARK_BLUE} />
      <circle cx="42" cy="8" r="5" fill={MARK_INK} />
      <circle cx="43" cy="24" r="5" fill={MARK_BLUE} />
      <circle cx="42" cy="40" r="5" fill={MARK_INK} />
    </svg>
  );
}
