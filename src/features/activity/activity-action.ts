import { ActivityAction } from '@/api/schema';

/** Names of the actions in the filter. A new API action fails the build until it is named. */
export const ACTIVITY_ACTION_LABELS: Record<ActivityAction, string> = {
  [ActivityAction.product_created]: 'Product created',
  [ActivityAction.product_updated]: 'Product updated',
  [ActivityAction.product_deleted]: 'Product deleted',
  [ActivityAction.products_bulk_updated]: 'Bulk edit',
  [ActivityAction.products_bulk_deleted]: 'Bulk delete',
  [ActivityAction.products_imported]: 'Products imported',
  [ActivityAction.product_view_created]: 'View saved',
  [ActivityAction.product_view_deleted]: 'View deleted',
  [ActivityAction.api_key_created]: 'API key created',
  [ActivityAction.api_key_revoked]: 'API key revoked',
  [ActivityAction.inventory_adjusted]: 'Stock adjusted',
};

export function toActivityAction(value: string | null): ActivityAction | undefined {
  return Object.values(ActivityAction).find((action) => action === value);
}
