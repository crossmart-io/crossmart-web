import { createContext, useContext } from 'react';
import type { ProductChannelRef } from '../../hooks/useProductChannels';
import type { ListingEditor } from '../../listings.types';
import type { ProductDefaults } from '../../override-form';

/** What every field of the listing editor reads: the listing, the product's values, and access. */
export interface ListingEditorContextValue {
  listingRef: ProductChannelRef;
  /** The listing as the API reads it: per field, the product's value, the override, the result. */
  listing: ListingEditor;
  /** The product's values, which a field goes back to. */
  productDefaults: ProductDefaults;
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
