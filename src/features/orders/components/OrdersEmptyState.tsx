import { ShoppingBag } from 'lucide-react';
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

interface OrdersEmptyStateProps {
  isFiltered: boolean;
  onClearFilters: () => void;
}

/** No orders yet, or none that match the filters. */
export function OrdersEmptyState({ isFiltered, onClearFilters }: OrdersEmptyStateProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingBag />
        </EmptyMedia>
        <EmptyTitle>{isFiltered ? 'No orders match' : 'No orders yet'}</EmptyTitle>
        <EmptyDescription>
          {isFiltered
            ? 'Try another status, store or order number.'
            : 'Orders from your connected stores appear here as they are placed, and reserve their stock in every store.'}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {isFiltered ? (
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link to={ROUTES.channels}>Manage stores</Link>
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
}
