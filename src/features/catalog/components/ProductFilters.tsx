import { Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
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
      <InputGroup className="sm:w-72">
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search title, handle or SKU"
          aria-label="Search products"
          spellCheck={false}
        />
      </InputGroup>
    </div>
  );
}
