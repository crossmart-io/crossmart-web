import { ListingDisplayState } from '@/api/schema';
import type { Product, ProductSummary } from '../catalog.types';
import type { SoldState } from './mark-sold';

/** States in which a product is not on the store, so marking it sold leaves that store alone. */
const OFF_STORE_STATES: readonly ListingDisplayState[] = [
  ListingDisplayState.draft,
  ListingDisplayState.removed,
];

/** A row of the products list: its stock, and the stores it is in. */
export function soldStateOfSummary(product: ProductSummary): SoldState {
  return {
    available: product.totalAvailable ?? 0,
    storeNames: product.stores
      .filter((store) => !OFF_STORE_STATES.includes(store.displayState))
      .map((store) => store.storeName),
  };
}

/** A product's page: its tracked stock, with the names of the stores it is in. */
export function soldStateOfProduct(product: Product, storeNames: readonly string[]): SoldState {
  const available = product.variants
    .filter((variant) => variant.tracked)
    .reduce((sum, variant) => sum + Math.max(variant.available, 0), 0);
  return { available, storeNames };
}
