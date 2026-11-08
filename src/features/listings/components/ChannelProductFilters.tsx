import { FilterTabs } from '@/components/lists/FilterTabs';
import { SearchInput } from '@/components/lists/SearchInput';
import { SortSelect } from '@/components/lists/SortSelect';
import type { useChannelProductFilters } from '../hooks/useChannelProductFilters';
import {
  ALL_CHANNEL_PRODUCTS,
  CHANNEL_PRODUCT_FILTERS,
  CHANNEL_PRODUCT_SORTS,
  type ChannelProductFilter,
  IN_STORE_STATES,
} from '../listings.constants';
import type { ChannelProductCounts } from '../listings.types';

interface ChannelProductFiltersProps {
  filters: ReturnType<typeof useChannelProductFilters>;
  counts?: ChannelProductCounts;
}

/**
 * Counts per tab: each state in the store, and their sum for "All". Needs details is read from
 * the listings themselves, so its tab has no count.
 */
function tabCounts(counts: ChannelProductCounts): Partial<Record<ChannelProductFilter, number>> {
  const total = IN_STORE_STATES.reduce((sum, state) => sum + counts[state], 0);
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
        counts={counts ? tabCounts(counts) : undefined}
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
