import { Skeleton } from '@/components/ui/skeleton';
import { useInventoryReport } from '../hooks/useInventoryReport';
import { InventoryValueTiles } from './InventoryValueTiles';
import { LowestStockCard } from './LowestStockCard';
import { StockLevelBar } from './StockLevelBar';

/**
 * The overview's inventory section: stock value, stock levels and what to restock first, as of
 * now. Stock has no history the levels can be rebuilt from, so there is no chart over time.
 */
export function InventoryOverview({ workspaceId }: { workspaceId: string }) {
  const { data: report, isError } = useInventoryReport(workspaceId);
  return (
    <section aria-labelledby="inventory-heading" className="flex flex-col gap-4">
      <h2 id="inventory-heading" className="font-heading text-lg font-semibold">
        Inventory
      </h2>
      {isError && <p className="text-sm text-destructive">Inventory could not be loaded.</p>}
      {!report && !isError && <Skeleton className="h-64 w-full rounded-xl" aria-busy="true" />}
      {report && (
        <>
          <InventoryValueTiles report={report} />
          <div className="grid items-start gap-4 lg:grid-cols-2">
            <StockLevelBar report={report} />
            <LowestStockCard report={report} />
          </div>
        </>
      )}
    </section>
  );
}
