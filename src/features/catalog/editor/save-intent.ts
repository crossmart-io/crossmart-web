import { ProductStatus } from '@/api/schema';
import type { Product } from '../catalog.types';

/** The two ways to save a new product. */
export enum SaveIntent {
  /** Active, and added to the stores chosen. */
  Publish = 'publish',
  /** Kept off every store while it is being finished. */
  Draft = 'draft',
}

export const SAVE_INTENT_STATUS: Record<SaveIntent, ProductStatus> = {
  [SaveIntent.Publish]: ProductStatus.ACTIVE,
  [SaveIntent.Draft]: ProductStatus.DRAFT,
};

/** Where to go once a new product is saved, and what that page should show about it. */
export interface CreatedDestination {
  to: string;
  state?: unknown;
}

/** What the page does after a new product is saved, such as adding it to stores. */
export type AfterCreate = (
  product: Product,
  intent: SaveIntent,
) => Promise<CreatedDestination | undefined>;
