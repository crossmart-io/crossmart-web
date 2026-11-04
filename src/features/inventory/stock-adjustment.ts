import { StockAdjustmentMode } from '@/api/schema';
import { MAX_STOCK_QUANTITY } from './inventory.constants';
import type { InventoryItem } from './inventory.types';

const WHOLE_NUMBER = /^-?\d+$/;

/**
 * The quantity typed in the adjust form, or null when it cannot be sent: not a whole number,
 * zero units to add, or a stock on hand below zero or above the limit.
 */
export function parseAdjustment(
  text: string,
  mode: StockAdjustmentMode,
  onHand: number,
): number | null {
  const trimmed = text.trim();
  if (!WHOLE_NUMBER.test(trimmed)) return null;
  const quantity = Number(trimmed);
  if (mode === StockAdjustmentMode.delta && quantity === 0) return null;
  const next = nextOnHand(onHand, mode, quantity);
  return next >= 0 && next <= MAX_STOCK_QUANTITY ? quantity : null;
}

export function nextOnHand(onHand: number, mode: StockAdjustmentMode, quantity: number): number {
  return mode === StockAdjustmentMode.set ? quantity : onHand + quantity;
}

/** "Blue / Large", or null for a product without options. */
export function variantLabel(item: Pick<InventoryItem, 'optionValues'>): string | null {
  return item.optionValues.length > 0 ? item.optionValues.join(' / ') : null;
}

/** "+5" or "−3", with a real minus sign. */
export function formatDelta(delta: number): string {
  const units = Math.abs(delta).toLocaleString();
  return delta > 0 ? `+${units}` : `−${units}`;
}
