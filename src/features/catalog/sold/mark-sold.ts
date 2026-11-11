import { formatList } from '@/lib/format';
import { MARK_SOLD_COPY } from '../catalog.constants';
import type { ProductSale } from '../catalog.types';

/** What marking it sold would change: no stock left anywhere, and in no store. */
export interface SoldState {
  /** Tracked units still available. */
  available: number;
  /** The stores it is in, by name, which it would come off. */
  storeNames: readonly string[];
}

/** Sold already: nothing available and in no store, so marking it sold changes nothing. */
export function isSold({ available, storeNames }: SoldState): boolean {
  return available <= 0 && storeNames.length === 0;
}

/** The confirm's sentence, naming every store it comes off. */
export function markSoldDescription(storeNames: readonly string[]): string {
  return storeNames.length > 0
    ? MARK_SOLD_COPY.confirmWithStores(formatList(storeNames))
    : MARK_SOLD_COPY.confirmNoStores;
}

/** The toast after marking it sold: what changed, or that nothing did. */
export function markSoldMessage(sale: ProductSale): string {
  if (sale.alreadySold) return MARK_SOLD_COPY.alreadySold;
  const stores = sale.removedFromStores.map((store) => store.displayName);
  return stores.length > 0
    ? MARK_SOLD_COPY.doneWithStores(formatList(stores))
    : MARK_SOLD_COPY.done;
}
