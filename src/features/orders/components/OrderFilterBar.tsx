import { Search } from 'lucide-react';
import type { OrderStatus } from '@/api/schema';
import { FilterSelect } from '@/components/lists/FilterSelect';
import { toEnumOptions } from '@/lib/enum';
import { SortSelect } from '@/components/lists/SortSelect';
import { TIME_SORTS } from '@/components/lists/sort-options';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import type { OrderFilters } from '../hooks/useOrderFilters';
import { ORDER_STATUS_LABELS } from '../orders.constants';

const STATUS_OPTIONS = toEnumOptions<OrderStatus>(ORDER_STATUS_LABELS);

interface OrderFilterBarProps {
  filters: OrderFilters;
  /** The workspace's stores, to filter by one. */
  stores: readonly { id: string; name: string }[];
}

/** Narrows the orders by number, status and store, and orders them by time. */
export function OrderFilterBar({ filters, stores }: OrderFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row">
        <FilterSelect
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={filters.setStatus}
          anyLabel="All statuses"
          label="Filter by status"
        />
        {stores.length > 1 && (
          <FilterSelect
            options={stores.map(({ id, name }) => ({ value: id, label: name }))}
            value={filters.storeId}
            onChange={filters.setStoreId}
            anyLabel="All stores"
            label="Filter by store"
          />
        )}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SortSelect options={TIME_SORTS} value={filters.sort.value} onChange={filters.setSort} />
        <InputGroup className="lg:w-64">
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={filters.search}
            onChange={(event) => filters.setSearch(event.target.value)}
            placeholder="Search order number"
            aria-label="Search orders"
            spellCheck={false}
          />
        </InputGroup>
      </div>
    </div>
  );
}
