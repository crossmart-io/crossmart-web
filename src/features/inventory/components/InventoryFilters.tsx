import { Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { InventoryListFilters } from '../hooks/useInventoryListFilters';
import { STOCK_LEVEL_FILTERS, type StockLevelFilter } from '../stock-level';

function isStockLevelFilter(value: string): value is StockLevelFilter {
  return STOCK_LEVEL_FILTERS.some((filter) => filter.value === value);
}

export function InventoryFilters({ filters }: { filters: InventoryListFilters }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <ToggleGroup
        type="single"
        variant="outline"
        value={filters.stockLevel}
        // A single toggle group reports '' when the active item is pressed again; keep it.
        onValueChange={(value) => isStockLevelFilter(value) && filters.setStockLevel(value)}
        aria-label="Filter by stock level"
        className="flex-wrap"
      >
        {STOCK_LEVEL_FILTERS.map((filter) => (
          <ToggleGroupItem key={filter.value} value={filter.value} className="px-3">
            {filter.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <InputGroup className="lg:w-72">
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          value={filters.search}
          onChange={(event) => filters.setSearch(event.target.value)}
          placeholder="Search SKU or product"
          aria-label="Search inventory"
          spellCheck={false}
        />
      </InputGroup>
    </div>
  );
}
