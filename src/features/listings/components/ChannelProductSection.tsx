import { useEffect } from 'react';
import { useLocalPagination } from '@/hooks/usePagination';
import { channelProductFilterQuery } from '../channel-product-filter';
import { useChannelProducts } from '../hooks/useChannelProducts';
import type { ChannelProductFilter } from '../listings.constants';
import { channelProductFilterLabel } from '../store-listing-views';
import type {
  ChannelProductListQuery,
  ChannelProductRowActions,
  ReportCounts,
} from './channel-product-list.types';
import { ChannelProductsTable } from './ChannelProductsTable';

interface ChannelProductSectionProps {
  filter: ChannelProductFilter;
  query: ChannelProductListQuery;
  rows: ChannelProductRowActions;
  onCounts: ReportCounts;
  /** Tells the view how many products the section holds once it loaded. */
  onTotal: (filter: ChannelProductFilter, total: number) => void;
}

/** One state of a view with several: its heading and its own pages, hidden while empty. */
export function ChannelProductSection({
  filter,
  query,
  rows,
  onCounts,
  onTotal,
}: ChannelProductSectionProps) {
  const ref = { workspaceId: rows.store.workspaceId, connectionId: rows.store.connectionId };
  const listQuery = { ...channelProductFilterQuery(filter), ...query };
  const pagination = useLocalPagination(JSON.stringify(listQuery));
  const products = useChannelProducts(ref, listQuery, pagination);
  const loadedTotal = products.isSuccess ? products.total : undefined;
  useEffect(() => {
    if (loadedTotal !== undefined) onTotal(filter, loadedTotal);
  }, [filter, loadedTotal, onTotal]);
  useEffect(() => {
    if (products.counts) onCounts(products.counts);
  }, [products.counts, onCounts]);
  if (loadedTotal === 0) return null;
  const headingId = `listings-${filter}`;
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <h3 id={headingId} className="flex items-baseline gap-2 text-sm font-semibold">
        {channelProductFilterLabel(filter)}
        {loadedTotal !== undefined && (
          <span className="text-xs font-normal text-muted-foreground tabular-nums">
            {loadedTotal.toLocaleString()}
          </span>
        )}
      </h3>
      <ChannelProductsTable products={products} pagination={pagination} {...rows} />
    </section>
  );
}
