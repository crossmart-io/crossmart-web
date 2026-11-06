import { createContext, useContext } from 'react';
import type { ProductChannelRef } from '../../hooks/useProductChannels';
import type { Product, ProductChannel } from '../../listings.types';

/** What every field of the listing editor reads: the product, the store's listing, and access. */
export interface ListingEditorContextValue {
  listingRef: ProductChannelRef;
  product: Product;
  channel: ProductChannel;
  /** The workspace's currency, which the product's prices are in. */
  catalogCurrency: string;
  /** Without the permission to edit listings, fields show but cannot change. */
  readOnly: boolean;
}

export const ListingEditorContext = createContext<ListingEditorContextValue | null>(null);

export function useListingEditorContext(): ListingEditorContextValue {
  const value = useContext(ListingEditorContext);
  if (!value) throw new Error('useListingEditorContext is used outside the listing editor.');
  return value;
}
