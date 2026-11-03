import { InventoryMovementReason, InventorySort, SortDirection } from '@/api/schema';
import type { SortOption } from '@/components/lists/sort-options';

export const INVENTORY_ITEMS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/inventory-items';
export const INVENTORY_ADJUSTMENTS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/inventory-items/{inventoryItemId}/adjustments';
export const INVENTORY_MOVEMENTS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/inventory-items/{inventoryItemId}/movements';

export const INVENTORY_SORTS: readonly [SortOption<InventorySort>, ...SortOption<InventorySort>[]] =
  [
    {
      value: 'title-asc',
      label: 'Product A–Z',
      sort: InventorySort.title,
      direction: SortDirection.asc,
    },
    {
      value: 'title-desc',
      label: 'Product Z–A',
      sort: InventorySort.title,
      direction: SortDirection.desc,
    },
    {
      value: 'available-asc',
      label: 'Least available',
      sort: InventorySort.available,
      direction: SortDirection.asc,
    },
    {
      value: 'available-desc',
      label: 'Most available',
      sort: InventorySort.available,
      direction: SortDirection.desc,
    },
    {
      value: 'updated-desc',
      label: 'Recently changed',
      sort: InventorySort.updated_at,
      direction: SortDirection.desc,
    },
  ];

/** Mirror the API's limits, so the form can say so before a round trip. */
export const MAX_STOCK_QUANTITY = 1_000_000;
export const MOVEMENT_NOTE_MAX_LENGTH = 500;

/** The reasons the API accepts for an adjustment, in the order the form offers them. */
export const MANUAL_MOVEMENT_REASONS = [
  InventoryMovementReason.RECEIVED,
  InventoryMovementReason.CORRECTION,
  InventoryMovementReason.RETURNED,
  InventoryMovementReason.DAMAGED,
  InventoryMovementReason.LOST,
  InventoryMovementReason.SOLD,
] as const satisfies readonly InventoryMovementReason[];

export const INVENTORY_FEEDBACK = {
  adjusted: 'Stock updated',
} as const;
