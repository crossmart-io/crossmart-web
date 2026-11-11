import { useEffect } from 'react';
import { useUrlPagination } from '@/hooks/usePagination';
import type { ChannelProductFilterQuery } from '../channel-product-filter';
import { useChannelProducts } from '../hooks/useChannelProducts';
import type {
  ChannelProductListQuery,
  ChannelProductRowActions,
  ReportCounts,
} from './channel-product-list.types';
import { ChannelProductsTable } from './ChannelProductsTable';

interface ChannelProductListProps {
  /** The view or precise filter the list shows. */
  filter: ChannelProductFilterQuery;
  query: ChannelProductListQuery;
  rows: ChannelProductRowActions;
  onCounts: ReportCounts;
}

/** One view of the store's products: one request, one table, its page kept in the URL. */
export function ChannelProductList({ filter, query, rows, onCounts }: ChannelProductListProps) {
  const ref = { workspaceId: rows.store.workspaceId, connectionId: rows.store.connectionId };
  const pagination = useUrlPagination();
  const products = useChannelProducts(ref, { ...filter, ...query }, pagination);
  useEffect(() => {
    if (products.counts) onCounts(products.counts);
  }, [products.counts, onCounts]);
  return <ChannelProductsTable products={products} pagination={pagination} {...rows} />;
}
