import { History } from 'lucide-react';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { TablePagination } from '@/components/lists/TablePagination';
import { useState } from 'react';
import type { InventoryMovementReason } from '@/api/schema';
import { FilterSelect } from '@/components/lists/FilterSelect';
import { toEnumOptions } from '@/lib/enum';
import { SortSelect } from '@/components/lists/SortSelect';
import { TIME_SORTS, toSortOption } from '@/components/lists/sort-options';
import { useLocalPagination } from '@/hooks/usePagination';
import { MOVEMENT_REASON_LABELS } from '../movement-reason';
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
const REASON_OPTIONS = toEnumOptions<InventoryMovementReason>(MOVEMENT_REASON_LABELS);

interface StockHistorySheetProps {
  workspaceId: string;
  /** The row whose history is open; null when the sheet is closed. */
  item: InventoryItem | null;
  onClose: () => void;
  /** Whether the member may adjust stock; without it the history is read-only. */
  canAdjust: boolean;
}

/** Every change to one variant’s stock, filtered by reason, newest or oldest first. */
export function StockHistorySheet({
  workspaceId,
  item,
  onClose,
  canAdjust,
}: StockHistorySheetProps) {
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
            {item.tracked && canAdjust && (
              <div className="flex justify-end">
                <AdjustStockPopover workspaceId={workspaceId} item={item} />
              </div>
            )}
            <HistoryBody
              key={item.inventoryItemId}
              workspaceId={workspaceId}
              inventoryItemId={item.inventoryItemId}
            />
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
  const [reason, setReason] = useState<InventoryMovementReason>();
  const [sortValue, setSort] = useState<string>(TIME_SORTS[0].value);
  const sort = toSortOption(TIME_SORTS, sortValue);
  const pagination = useLocalPagination(`${reason ?? ''}|${sort.value}`);
  const history = useStockMovements(
    { workspaceId, inventoryItemId, reason, direction: sort.direction },
    pagination,
  );
  const filterBar = (
    <div className="flex flex-col gap-2 sm:flex-row">
      <FilterSelect
        options={REASON_OPTIONS}
        value={reason}
        onChange={setReason}
        anyLabel="All reasons"
        label="Filter by reason"
      />
      <SortSelect options={TIME_SORTS} value={sort.value} onChange={setSort} />
    </div>
  );

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
  if (history.movements.length === 0 && !reason) return <EmptyHistory />;
  return (
    <>
      {filterBar}
      {history.movements.length === 0 ? (
        <p className="text-sm text-muted-foreground">No changes for this reason.</p>
      ) : (
        <MovementList movements={history.movements} />
      )}
      <TablePagination
        pagination={pagination}
        total={history.total}
        pageCount={history.pageCount}
        noun="change"
        isFetching={history.isPlaceholderData}
      />
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
