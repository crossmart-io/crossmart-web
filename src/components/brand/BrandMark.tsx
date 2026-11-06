import { cn } from '@/lib/utils';

/** Ink follows the text colour, so the mark works on light, dark and brand backgrounds. */
const MARK_INK = 'currentColor';
/** Brand blue by default; a surface can set `--mark-accent` to recolour the source node. */
const MARK_ACCENT = 'var(--mark-accent, var(--brand))';

/** The Crossmart "one to many" mark: one source fanning out to three channels. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn('size-6 shrink-0', className)}>
      <g strokeWidth="7" strokeLinecap="round">
        <line x1="12" y1="24" x2="42" y2="8" stroke={MARK_INK} />
        <line x1="12" y1="24" x2="42" y2="40" stroke={MARK_INK} />
        <line x1="12" y1="24" x2="43" y2="24" stroke={MARK_ACCENT} />
      </g>
      <circle cx="11" cy="24" r="8" fill={MARK_ACCENT} />
      <circle cx="42" cy="8" r="5" fill={MARK_INK} />
      <circle cx="43" cy="24" r="5" fill={MARK_ACCENT} />
      <circle cx="42" cy="40" r="5" fill={MARK_INK} />
    </svg>
  );
}
