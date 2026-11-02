import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { STATUS_FILTERS, type StatusFilter } from '../product-status';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
}

function isStatusFilter(value: string): value is StatusFilter {
  return STATUS_FILTERS.some((filter) => filter.value === value);
}

export function ProductFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Tabs
        value={status}
        onValueChange={(value) => isStatusFilter(value) && onStatusChange(value)}
      >
        <TabsList>
          {STATUS_FILTERS.map((filter) => (
            <TabsTrigger key={filter.value} value={filter.value}>
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="relative sm:w-72">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search title, handle or SKU"
          aria-label="Search products"
          className="pl-8"
        />
      </div>
    </div>
  );
}
