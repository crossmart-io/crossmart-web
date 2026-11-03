import { ActivityAction } from '@/api/schema';

/** Names of the actions in the filter. A new API action fails the build until it is named. */
export const ACTIVITY_ACTION_LABELS: Record<ActivityAction, string> = {
  [ActivityAction.product_created]: 'Product created',
  [ActivityAction.product_updated]: 'Product updated',
  [ActivityAction.product_deleted]: 'Product deleted',
  [ActivityAction.products_bulk_updated]: 'Bulk edit',
  [ActivityAction.products_bulk_deleted]: 'Bulk delete',
  [ActivityAction.products_imported]: 'Products imported',
  [ActivityAction.products_updated_by_import]: 'Products updated by import',
  [ActivityAction.stock_imported]: 'Stock imported',
  [ActivityAction.channel_catalog_imported]: 'Channel catalog imported',
  [ActivityAction.product_view_created]: 'View saved',
  [ActivityAction.product_view_deleted]: 'View deleted',
  [ActivityAction.api_key_created]: 'API key created',
  [ActivityAction.api_key_revoked]: 'API key revoked',
  [ActivityAction.inventory_adjusted]: 'Stock adjusted',
  [ActivityAction.channel_connected]: 'Channel connected',
  [ActivityAction.channel_disconnected]: 'Channel disconnected',
  [ActivityAction.channel_connect_failed]: 'Channel connection failed',
  [ActivityAction.listing_published]: 'Listing published',
  [ActivityAction.listing_updated]: 'Listing updated',
  [ActivityAction.listing_sync_failed]: 'Listing sync failed',
  [ActivityAction.listing_delisted]: 'Listing delisted',
  [ActivityAction.listing_added]: 'Added to a store',
  [ActivityAction.listing_removed]: 'Removed from a store',
  [ActivityAction.listing_override_updated]: 'Channel overrides changed',
  [ActivityAction.channel_pricing_updated]: 'Pricing rule changed',
  [ActivityAction.channel_selection_updated]: 'Product selection changed',
  [ActivityAction.channel_sync_requested]: 'Channel sync started',
};

export function toActivityAction(value: string | null): ActivityAction | undefined {
  return Object.values(ActivityAction).find((action) => action === value);
}
