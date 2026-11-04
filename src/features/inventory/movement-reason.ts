import { InventoryMovementReason } from '@/api/schema';

export const MOVEMENT_REASON_LABELS: Record<InventoryMovementReason, string> = {
  [InventoryMovementReason.OPENING_BALANCE]: 'Initial stock',
  [InventoryMovementReason.ADJUSTMENT]: 'Product edited',
  [InventoryMovementReason.CORRECTION]: 'Stock count',
  [InventoryMovementReason.RECEIVED]: 'Received',
  [InventoryMovementReason.RETURNED]: 'Returned',
  [InventoryMovementReason.DAMAGED]: 'Damaged',
  [InventoryMovementReason.LOST]: 'Lost',
  [InventoryMovementReason.SOLD]: 'Sold elsewhere',
  [InventoryMovementReason.IMPORTED]: 'Imported',
  [InventoryMovementReason.ORDER_SHIPPED]: 'Order shipped',
};
