import { Skeleton } from '@/components/ui/skeleton';
import { useInventoryReport } from '../hooks/useInventoryReport';
import { InventoryValueTiles } from './InventoryValueTiles';

/** What the stock on hand is worth, above the stock list; nothing when it cannot be read. */
export function StockValueTiles({ workspaceId }: { workspaceId: string }) {
  const { data: report, isError } = useInventoryReport(workspaceId);
  if (isError) return null;
  if (!report) return <Skeleton className="h-28 w-full rounded-xl" aria-busy="true" />;
  return <InventoryValueTiles report={report} />;
}
