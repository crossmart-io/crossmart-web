import { BulkProductAction } from '@/api/schema';
import { pluralize } from '@/lib/format';

/** What the toast says once a bulk action is done. */
export const BULK_ACTION_DONE: Record<BulkProductAction, (affected: number) => string> = {
  [BulkProductAction.set_status]: (affected) =>
    `Status changed on ${pluralize(affected, 'product')}`,
  [BulkProductAction.add_tags]: (affected) => `Tags added to ${pluralize(affected, 'product')}`,
  [BulkProductAction.remove_tags]: (affected) =>
    `Tags removed from ${pluralize(affected, 'product')}`,
  [BulkProductAction.adjust_prices]: (affected) =>
    `Prices updated on ${pluralize(affected, 'product')}`,
  [BulkProductAction.delete]: (affected) => `Deleted ${pluralize(affected, 'product')}`,
};
