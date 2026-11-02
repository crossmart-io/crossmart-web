import { PackageOpen, SearchX } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface ProductsEmptyStateProps {
  isFiltered: boolean;
  onClearFilters: () => void;
  /** Ways to add products, shown when the catalog itself is empty. */
  actions: ReactNode;
}

export function ProductsEmptyState({
  isFiltered,
  onClearFilters,
  actions,
}: ProductsEmptyStateProps) {
  if (isFiltered) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>No products match</EmptyTitle>
          <EmptyDescription>Try another search, or clear the filters.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        </EmptyContent>
      </Empty>
    );
  }
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpen />
        </EmptyMedia>
        <EmptyTitle>Your catalog is empty</EmptyTitle>
        <EmptyDescription>
          Import a product export from Shopify, or add your first product by hand.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center">{actions}</EmptyContent>
    </Empty>
  );
}
