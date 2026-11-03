import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { ProductSelectionRule } from '../listings.types';
import { describeSelection } from '../selection-draft';
import { ProductSelectionCard } from './ProductSelectionCard';

interface SelectionSummaryProps {
  workspaceId: string;
  connectionId: string;
  rule: ProductSelectionRule | null;
  canManage: boolean;
}

/** Which products the store gets, in one line, with the full rule editor a click away. */
export function SelectionSummary({
  workspaceId,
  connectionId,
  rule,
  canManage,
}: SelectionSummaryProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 px-4 py-3">
      <p className="text-sm">
        <span className="text-muted-foreground">Products in this store: </span>
        <span className="font-medium">{describeSelection(rule)}</span>
      </p>
      {canManage && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal data-icon="inline-start" />
              Change
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
            <SheetHeader>
              <SheetTitle>Products in this store</SheetTitle>
              <SheetDescription>
                Choose them by filter or by hand. Sync now applies the change.
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4">
              <ProductSelectionCard
                workspaceId={workspaceId}
                connectionId={connectionId}
                rule={rule}
                canManage={canManage}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
