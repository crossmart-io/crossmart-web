import { FilterTabs } from '@/components/lists/FilterTabs';
import { SearchInput } from '@/components/lists/SearchInput';
import { SortSelect } from '@/components/lists/SortSelect';
import type { useChannelProductFilters } from '../hooks/useChannelProductFilters';
import {
  ALL_CHANNEL_PRODUCTS,
  CHANNEL_PRODUCT_FILTERS,
  CHANNEL_PRODUCT_SORTS,
  type ChannelProductFilter,
} from '../listings.constants';
import type { ChannelProductCounts } from '../listings.types';

interface ChannelProductFiltersProps {
  filters: ReturnType<typeof useChannelProductFilters>;
  counts?: ChannelProductCounts;
}

function withTotal(counts: ChannelProductCounts): Record<ChannelProductFilter, number> {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  return { ...counts, [ALL_CHANNEL_PRODUCTS]: total };
}

/** Filter by state (with counts), search and sort the store's products. */
export function ChannelProductFilters({ filters, counts }: ChannelProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <FilterTabs
        tabs={CHANNEL_PRODUCT_FILTERS}
        value={filters.filter}
        onChange={filters.setFilter}
        counts={counts ? withTotal(counts) : undefined}
        label="Filter by state in this store"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={filters.search.value}
          onChange={filters.search.setValue}
          placeholder="Search title, handle or SKU"
          label="Search products"
        />
        <SortSelect
          options={CHANNEL_PRODUCT_SORTS}
          value={filters.sort.value}
          onChange={filters.setSort}
        />
      </div>
    </div>
  );
}
