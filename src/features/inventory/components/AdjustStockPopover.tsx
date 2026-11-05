import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { InventoryItem } from '../inventory.types';
import { variantLabel } from '../stock-adjustment';
import { AdjustStockForm } from './AdjustStockForm';

interface AdjustStockPopoverProps {
  workspaceId: string;
  item: InventoryItem;
  /** Only the icon on phones, as in a table row. */
  compact?: boolean;
}

/** Quick stock change from the inventory row, without leaving the list. */
export function AdjustStockPopover({
  workspaceId,
  item,
  compact = false,
}: AdjustStockPopoverProps) {
  const [open, setOpen] = useState(false);
  const name = [item.productTitle, variantLabel(item)].filter(Boolean).join(' · ');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" aria-label={`Adjust stock of ${name}`}>
          <SlidersHorizontal data-icon="inline-start" />
          <span className={cn(compact && 'hidden sm:inline')}>Adjust</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(20rem,calc(100vw-2rem))]">
        <PopoverHeader>
          <PopoverTitle>Adjust stock</PopoverTitle>
          <PopoverDescription className="truncate">{item.sku ?? name}</PopoverDescription>
        </PopoverHeader>
        {/* Mounted only while open, so the form starts fresh every time. */}
        {open && (
          <AdjustStockForm workspaceId={workspaceId} item={item} onDone={() => setOpen(false)} />
        )}
      </PopoverContent>
    </Popover>
  );
}
