import { Package } from 'lucide-react';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

/** A view of the store's listings with nothing in it. */
export function ChannelProductsEmpty() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Package />
        </EmptyMedia>
        <EmptyTitle>No products here</EmptyTitle>
        <EmptyDescription>Try another view, or add products from the catalog.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
