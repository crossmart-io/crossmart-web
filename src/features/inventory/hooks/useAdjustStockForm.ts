import { useState } from 'react';
import { InventoryMovementReason, StockAdjustmentMode } from '@/api/schema';
import type { AdjustStockBody, InventoryItem } from '../inventory.types';
import { parseAdjustment } from '../stock-adjustment';

/** A count is usually a correction; anything else usually a delivery. */
const DEFAULT_REASON: Record<StockAdjustmentMode, InventoryMovementReason> = {
  [StockAdjustmentMode.delta]: InventoryMovementReason.RECEIVED,
  [StockAdjustmentMode.set]: InventoryMovementReason.CORRECTION,
};

/** The adjust form's fields, and the request body once they make a valid change. */
export function useAdjustStockForm(item: InventoryItem) {
  const [mode, setMode] = useState<StockAdjustmentMode>(StockAdjustmentMode.delta);
  const [quantityText, setQuantityText] = useState('');
  const [reason, setReason] = useState<InventoryMovementReason>(DEFAULT_REASON[mode]);
  const [note, setNote] = useState('');
  const quantity = parseAdjustment(quantityText, mode, item.onHand);
  const body: AdjustStockBody | null =
    quantity === null ? null : { mode, quantity, reason, note: note.trim() || undefined };

  /** Switching to "set to" starts from the current stock, so a count is one small edit. */
  function changeMode(next: StockAdjustmentMode) {
    setMode(next);
    setReason(DEFAULT_REASON[next]);
    setQuantityText(next === StockAdjustmentMode.set ? String(item.onHand) : '');
  }

  return {
    mode,
    changeMode,
    quantityText,
    setQuantityText,
    quantity,
    isQuantityInvalid: quantityText.trim() !== '' && quantity === null,
    reason,
    setReason,
    note,
    setNote,
    body,
  };
}
