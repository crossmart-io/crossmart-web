import { PackageOpen, SearchX } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { ROUTES } from '@/config/routes';

interface InventoryEmptyStateProps {
  isFiltered: boolean;
  onClearFilters: () => void;
}

export function InventoryEmptyState({ isFiltered, onClearFilters }: InventoryEmptyStateProps) {
  if (isFiltered) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>No stock matches</EmptyTitle>
          <EmptyDescription>Try another SKU or product, or clear the filters.</EmptyDescription>
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
        <EmptyTitle>No stock to show yet</EmptyTitle>
        <EmptyDescription>Every variant you add to the catalog gets a row here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link to={ROUTES.products}>Go to products</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
