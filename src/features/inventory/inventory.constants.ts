import { InventoryMovementReason } from '@/api/schema';

export const INVENTORY_ITEMS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/inventory-items';
export const INVENTORY_ADJUSTMENTS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/inventory-items/{inventoryItemId}/adjustments';
export const INVENTORY_MOVEMENTS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/inventory-items/{inventoryItemId}/movements';

export const INVENTORY_PAGE_SIZE = 50;
export const MOVEMENTS_PAGE_SIZE = 25;

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
