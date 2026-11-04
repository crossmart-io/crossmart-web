import { Skeleton } from '@/components/ui/skeleton';
import { useInventoryReport } from '../hooks/useInventoryReport';
import { InventoryValueTiles } from './InventoryValueTiles';
import { StockLevelBar } from './StockLevelBar';
import { StoreHealthCard } from './StoreHealthCard';

/** The overview's inventory section: stock value, stock levels and store health, as of now. */
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
          <div className="grid gap-4 lg:grid-cols-2">
            <StockLevelBar report={report} />
            <StoreHealthCard report={report} />
          </div>
        </>
      )}
    </section>
  );
}
