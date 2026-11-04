import { Card, CardContent } from '@/components/ui/card';
import { formatMoney } from '@/lib/format';
import { toPeriodChange } from '../sales-format';
import { ChangeBadge } from './ChangeBadge';
import type { SalesReport } from '../sales.types';

interface KpiTileProps {
  label: string;
  value: string;
  current: number;
  previous: number;
  comparedTo: string;
}

function KpiTile({ label, value, current, previous, comparedTo }: KpiTileProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-heading text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
          {value}
        </p>
        <ChangeBadge change={toPeriodChange(current, previous)} comparedTo={comparedTo} />
      </CardContent>
    </Card>
  );
}

/** Sales, orders, average order value and units, each against the previous period. */
export function SalesKpiGrid({ report, comparedTo }: { report: SalesReport; comparedTo: string }) {
  const { current, previous, currencyCode } = report;
  const money = (amount: string | null) => (amount ? formatMoney(amount, currencyCode) : '–');
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <KpiTile
        label="Sales"
        value={money(current.sales)}
        current={Number(current.sales)}
        previous={Number(previous.sales)}
        comparedTo={comparedTo}
      />
      <KpiTile
        label="Orders"
        value={current.orders.toLocaleString()}
        current={current.orders}
        previous={previous.orders}
        comparedTo={comparedTo}
      />
      <KpiTile
        label="Average order value"
        value={money(current.averageOrderValue)}
        current={Number(current.averageOrderValue ?? 0)}
        previous={Number(previous.averageOrderValue ?? 0)}
        comparedTo={comparedTo}
      />
      <KpiTile
        label="Units sold"
        value={current.units.toLocaleString()}
        current={current.units}
        previous={previous.units}
        comparedTo={comparedTo}
      />
    </div>
  );
}
