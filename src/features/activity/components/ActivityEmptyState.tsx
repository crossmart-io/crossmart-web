import { History, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface ActivityEmptyStateProps {
  isFiltered: boolean;
  onClearFilters: () => void;
}

export function ActivityEmptyState({ isFiltered, onClearFilters }: ActivityEmptyStateProps) {
  if (isFiltered) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>No matching activity</EmptyTitle>
          <EmptyDescription>Nothing here matches these filters.</EmptyDescription>
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
          <History />
        </EmptyMedia>
        <EmptyTitle>No activity yet</EmptyTitle>
        <EmptyDescription>
          Changes to products, saved views and API keys show up here, with who made them.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
