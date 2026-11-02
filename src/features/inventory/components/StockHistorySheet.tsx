import { History } from 'lucide-react';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { LoadMoreButton } from '@/components/lists/LoadMoreButton';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useStockMovements } from '../hooks/useStockMovements';
import type { InventoryItem } from '../inventory.types';
import { variantLabel } from '../stock-adjustment';
import { AdjustStockPopover } from './AdjustStockPopover';
import { MovementList } from './MovementList';
import { StockSummary } from './StockSummary';

const HISTORY_SKELETON_ROWS = 4;

interface StockHistorySheetProps {
  workspaceId: string;
  /** The row whose history is open; null when the sheet is closed. */
  item: InventoryItem | null;
  onClose: () => void;
}

/** Every change to one variant's stock, newest first. */
export function StockHistorySheet({ workspaceId, item, onClose }: StockHistorySheetProps) {
  const details = item && [variantLabel(item), item.sku].filter(Boolean).join(' · ');

  return (
    <Sheet open={item !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="pr-12">
          <SheetTitle>{item?.productTitle ?? 'Stock history'}</SheetTitle>
          <SheetDescription>{details || 'Stock history'}</SheetDescription>
        </SheetHeader>
        {item && (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
            <StockSummary item={item} />
            {item.tracked && (
              <div className="flex justify-end">
                <AdjustStockPopover workspaceId={workspaceId} item={item} />
              </div>
            )}
            <HistoryBody workspaceId={workspaceId} inventoryItemId={item.inventoryItemId} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function HistoryBody({
  workspaceId,
  inventoryItemId,
}: {
  workspaceId: string;
  inventoryItemId: string;
}) {
  const history = useStockMovements({ workspaceId, inventoryItemId });

  if (history.isError) {
    return (
      <ErrorState
        title="History could not be loaded"
        error={history.error}
        onRetry={history.refetch}
      />
    );
  }
  if (history.isPending) {
    return <ListSkeleton label="Loading stock history" rows={HISTORY_SKELETON_ROWS} />;
  }
  if (history.movements.length === 0) return <EmptyHistory />;
  return (
    <>
      <MovementList movements={history.movements} />
      {history.hasNextPage && (
        <LoadMoreButton
          isLoading={history.isFetchingNextPage}
          onLoadMore={() => void history.fetchNextPage()}
        />
      )}
    </>
  );
}

function EmptyHistory() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <History />
        </EmptyMedia>
        <EmptyTitle>No changes yet</EmptyTitle>
        <EmptyDescription>Deliveries, counts and sales will be listed here.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
