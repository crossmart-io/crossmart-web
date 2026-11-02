import { ProductStatus } from '@/api/schema';

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  [ProductStatus.ACTIVE]: 'Active',
  [ProductStatus.DRAFT]: 'Draft',
  [ProductStatus.ARCHIVED]: 'Archived',
};

/** The status tabs above the product list. `All` is no filter. */
export const ALL_STATUSES = 'all';
export type StatusFilter = ProductStatus | typeof ALL_STATUSES;

export const STATUS_FILTERS: readonly { value: StatusFilter; label: string }[] = [
  { value: ALL_STATUSES, label: 'All' },
  ...Object.values(ProductStatus).map((status) => ({
    value: status,
    label: PRODUCT_STATUS_LABELS[status],
  })),
];

export function toStatusQuery(filter: StatusFilter): ProductStatus | undefined {
  return filter === ALL_STATUSES ? undefined : filter;
}
