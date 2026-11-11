import { FilterTabs } from '@/components/lists/FilterTabs';
import { SearchInput } from '@/components/lists/SearchInput';
import { SortSelect } from '@/components/lists/SortSelect';
import type { useChannelProductFilters } from '../hooks/useChannelProductFilters';
import { CHANNEL_PRODUCT_SORTS } from '../listings.constants';
import type { ChannelProductCounts } from '../listings.types';
import { STORE_LISTING_VIEW_TABS, storeListingViewCounts } from '../store-listing-views';

interface ChannelProductFiltersProps {
  filters: ReturnType<typeof useChannelProductFilters>;
  counts?: ChannelProductCounts;
}

/** Pick a view (with counts), search and sort the store's products. */
export function ChannelProductFilters({ filters, counts }: ChannelProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <FilterTabs
        tabs={STORE_LISTING_VIEW_TABS}
        value={filters.view}
        onChange={filters.setView}
        counts={counts ? storeListingViewCounts(counts) : undefined}
        label="Show products"
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
