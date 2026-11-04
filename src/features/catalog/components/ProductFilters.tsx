import { Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { STATUS_FILTERS, type StatusFilter } from '../product-status';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  /** Products per status, from the catalog stats. Absent while they load. */
  counts?: Partial<Record<StatusFilter, number>>;
}

function isStatusFilter(value: string): value is StatusFilter {
  return STATUS_FILTERS.some((filter) => filter.value === value);
}

export function ProductFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  counts,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <ToggleGroup
        type="single"
        variant="outline"
        value={status}
        // A single toggle group reports '' when the active item is pressed again; keep it.
        onValueChange={(value) => isStatusFilter(value) && onStatusChange(value)}
        aria-label="Filter by status"
        className="flex-wrap"
      >
        {STATUS_FILTERS.map((filter) => (
          <ToggleGroupItem key={filter.value} value={filter.value} className="gap-1.5 px-3">
            {filter.label}
            {counts?.[filter.value] !== undefined && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {counts[filter.value]?.toLocaleString()}
              </span>
            )}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
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
