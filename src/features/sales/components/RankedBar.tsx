import { PERCENT } from '../sales.constants';

/** A thin bar showing a row's share; the row's own text carries the numbers. */
export function RankedBar({ share }: { share: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
      <div
        className="h-full rounded-full bg-chart-1"
        style={{ width: `${Math.min(share, PERCENT)}%` }}
      />
    </div>
  );
}
