import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { SalesInterval } from '@/api/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BUCKET_TOOLTIP_PREFIX, SALES_CHART } from '../sales.constants';
import { formatBucket, formatCompactMoney } from '../sales-format';
import { SalesChartLegend } from './SalesChartLegend';
import { SalesChartTooltip, type SalesPoint } from './SalesChartTooltip';
import type { SalesReport } from '../sales.types';

const SALES_CHART_CONFIG = {
  sales: { label: 'This period', color: 'var(--chart-1)' },
  previousSales: { label: 'Previous period', color: 'var(--muted-foreground)' },
} satisfies ChartConfig;

function toPoints(report: SalesReport): SalesPoint[] {
  const name = (day: string) =>
    `${BUCKET_TOOLTIP_PREFIX[report.interval]}${formatBucket(day, report.interval)}`;
  return report.buckets.map((bucket) => ({
    startsOn: bucket.startsOn,
    sales: Number(bucket.sales),
    previousSales: Number(bucket.previousSales),
    name: name(bucket.startsOn),
    previousName: name(bucket.previousStartsOn),
  }));
}

/** Sales per day, week or month, with the previous period dashed behind it. */
export function SalesChart({ report, comparedTo }: { report: SalesReport; comparedTo: string }) {
  const interval: SalesInterval = report.interval;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales over time</CardTitle>
        <CardDescription>
          Order totals in {report.currencyCode}, against the {comparedTo}.
        </CardDescription>
        <SalesChartLegend />
      </CardHeader>
      <CardContent>
        <ChartContainer config={SALES_CHART_CONFIG} className="aspect-auto h-72 w-full">
          <AreaChart data={toPoints(report)} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="startsOn"
              tickLine={false}
              axisLine={false}
              minTickGap={SALES_CHART.xTickGap}
              tickFormatter={(day: string) => formatBucket(day, interval)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={SALES_CHART.yAxisWidth}
              tickFormatter={(amount: number) => formatCompactMoney(amount, report.currencyCode)}
            />
            <ChartTooltip
              content={(props) => <SalesChartTooltip {...props} currency={report.currencyCode} />}
            />
            <Area
              dataKey="previousSales"
              type="monotone"
              stroke="var(--color-previousSales)"
              strokeWidth={SALES_CHART.lineWidth}
              strokeDasharray={SALES_CHART.comparisonDash}
              fill="none"
              dot={false}
              activeDot={false}
            />
            <Area
              dataKey="sales"
              type="monotone"
              stroke="var(--color-sales)"
              strokeWidth={SALES_CHART.lineWidth}
              fill="var(--color-sales)"
              fillOpacity={SALES_CHART.areaOpacity}
            />
          </AreaChart>
        </ChartContainer>
        {interval !== SalesInterval.day && (
          <p className="mt-2 text-xs text-muted-foreground">
            The last {interval} is still in progress, so it shows only the days so far.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
