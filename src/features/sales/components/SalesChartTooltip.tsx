import { formatMoney } from '@/lib/format';

export interface SalesPoint {
  startsOn: string;
  sales: number;
  previousSales: number;
  /** The bucket as the tooltip names it, such as `Week of Nov 3`. */
  name: string;
  previousName: string;
}

interface SalesChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
  currency: string;
}

function TooltipRow({ swatch, label, amount }: { swatch: string; label: string; amount: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={swatch} aria-hidden="true" />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto pl-4 font-medium tabular-nums text-foreground">{amount}</span>
    </div>
  );
}

/** Both periods' sales for the hovered bucket, each named by its own dates. */
export function SalesChartTooltip({ active, payload, currency }: SalesChartTooltipProps) {
  const point = payload?.[0]?.payload as SalesPoint | undefined;
  if (!active || !point) return null;
  return (
    <div className="grid min-w-44 gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <TooltipRow
        swatch="size-2.5 shrink-0 rounded-[2px] bg-(--color-sales)"
        label={point.name}
        amount={formatMoney(String(point.sales), currency)}
      />
      <TooltipRow
        swatch="h-0 w-2.5 shrink-0 border-t-2 border-dashed border-(--color-previousSales)"
        label={point.previousName}
        amount={formatMoney(String(point.previousSales), currency)}
      />
    </div>
  );
}
