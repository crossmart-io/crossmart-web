import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { pluralize } from '@/lib/format';
import { useSalesRange } from '../hooks/useSalesRange';
import { useSalesReport } from '../hooks/useSalesReport';
import { SalesChart } from './SalesChart';
import { SalesKpiGrid } from './SalesKpiGrid';
import { SalesRangePicker } from './SalesRangePicker';
import { StoreSalesCard } from './StoreSalesCard';
import { TopProductsCard } from './TopProductsCard';

const KPI_TILES = 4;

function SalesSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: KPI_TILES }, (_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}

/** The overview's sales section: the period picker, totals, the chart and the breakdowns. */
export function SalesOverview({ workspaceId }: { workspaceId: string }) {
  const [range, setRange] = useSalesRange();
  const { data: report, isError } = useSalesReport(workspaceId, range.value);
  const comparedTo = `previous ${range.description.replace('last ', '')}`;

  return (
    <section aria-labelledby="sales-heading" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="sales-heading" className="font-heading text-lg font-semibold">
          Sales
        </h2>
        <SalesRangePicker value={range.value} onChange={setRange} />
      </div>
      {isError && <p className="text-sm text-destructive">Sales could not be loaded.</p>}
      {!report && !isError && <SalesSkeleton />}
      {report && (
        <>
          {report.otherCurrencyOrders > 0 && (
            <Alert>
              <Info aria-hidden="true" />
              <AlertDescription>
                {pluralize(report.otherCurrencyOrders, 'order')} in other currencies are not
                included. Totals are in {report.currencyCode}, the workspace currency.
              </AlertDescription>
            </Alert>
          )}
          <SalesKpiGrid report={report} comparedTo={comparedTo} />
          <SalesChart report={report} comparedTo={comparedTo} />
          <div className="grid gap-4 lg:grid-cols-2">
            <StoreSalesCard report={report} />
            <TopProductsCard report={report} />
          </div>
        </>
      )}
    </section>
  );
}
