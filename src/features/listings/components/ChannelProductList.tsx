import { useEffect } from 'react';
import { useUrlPagination } from '@/hooks/usePagination';
import { channelProductFilterQuery } from '../channel-product-filter';
import { useChannelProducts } from '../hooks/useChannelProducts';
import type { ChannelProductFilter } from '../listings.constants';
import type {
  ChannelProductListQuery,
  ChannelProductRowActions,
  ReportCounts,
} from './channel-product-list.types';
import { ChannelProductsTable } from './ChannelProductsTable';

interface ChannelProductListProps {
  filter: ChannelProductFilter;
  query: ChannelProductListQuery;
  rows: ChannelProductRowActions;
  onCounts: ReportCounts;
}

/** A view of one state: one table, its page kept in the URL. */
export function ChannelProductList({ filter, query, rows, onCounts }: ChannelProductListProps) {
  const ref = { workspaceId: rows.store.workspaceId, connectionId: rows.store.connectionId };
  const pagination = useUrlPagination();
  const products = useChannelProducts(
    ref,
    { ...channelProductFilterQuery(filter), ...query },
    pagination,
  );
  useEffect(() => {
    if (products.counts) onCounts(products.counts);
  }, [products.counts, onCounts]);
  return <ChannelProductsTable products={products} pagination={pagination} {...rows} />;
}
