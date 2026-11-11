import { useCallback, useState } from 'react';
import type { ChannelProductFilter } from '../listings.constants';
import type {
  ChannelProductListQuery,
  ChannelProductRowActions,
  ReportCounts,
} from './channel-product-list.types';
import { ChannelProductSection } from './ChannelProductSection';
import { ChannelProductsEmpty } from './ChannelProductsEmpty';

interface ChannelProductSectionsProps {
  filters: readonly ChannelProductFilter[];
  query: ChannelProductListQuery;
  rows: ChannelProductRowActions;
  onCounts: ReportCounts;
}

/** A view made of several states: a section per state, and one empty state when all are empty. */
export function ChannelProductSections({
  filters,
  query,
  rows,
  onCounts,
}: ChannelProductSectionsProps) {
  const [totals, setTotals] = useState<Partial<Record<ChannelProductFilter, number>>>({});
  const onTotal = useCallback(
    (filter: ChannelProductFilter, total: number) =>
      setTotals((current) =>
        current[filter] === total ? current : { ...current, [filter]: total },
      ),
    [],
  );
  const allEmpty = filters.every((filter) => totals[filter] === 0);
  return (
    <div className="flex flex-col gap-6">
      {filters.map((filter) => (
        <ChannelProductSection
          key={filter}
          filter={filter}
          query={query}
          rows={rows}
          onCounts={onCounts}
          onTotal={onTotal}
        />
      ))}
      {allEmpty && <ChannelProductsEmpty />}
    </div>
  );
}
