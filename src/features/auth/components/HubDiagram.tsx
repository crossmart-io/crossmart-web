import { cn } from '@/lib/utils';

/** Spoke end points: one source on the left fanning out to the channels on the right. */
const CHANNEL_NODES = [
  { cx: 420, cy: 60 },
  { cx: 460, cy: 170 },
  { cx: 470, cy: 280 },
  { cx: 460, cy: 390 },
  { cx: 420, cy: 500 },
] as const;
const SOURCE = { cx: 90, cy: 280 };

/** The "one to many" idea behind the mark, drawn large as a backdrop. */
export function HubDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 560"
      fill="none"
      aria-hidden="true"
      className={cn('pointer-events-none', className)}
    >
      {CHANNEL_NODES.map((node) => (
        <g key={`${node.cx}-${node.cy}`}>
          <line
            x1={SOURCE.cx}
            y1={SOURCE.cy}
            x2={node.cx}
            y2={node.cy}
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <circle cx={node.cx} cy={node.cy} r="26" fill="currentColor" />
        </g>
      ))}
      <circle cx={SOURCE.cx} cy={SOURCE.cy} r="56" fill="currentColor" />
    </svg>
  );
}
