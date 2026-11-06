import { useProduct } from '@/features/catalog';
import type { Product, ProductChannel } from '../listings.types';
import type { ProductChannelRef } from './useProductChannels';
import { useProductChannels } from './useProductChannels';

/** One product in one store: the product's own values, and the store's listing and changes. */
export interface ListingEditorData {
  product: Product;
  channel: ProductChannel;
}

export interface ListingEditorQuery {
  data: ListingEditorData | undefined;
  isPending: boolean;
  /** The product or the store's listing could not be loaded. */
  error: Error | null;
  /** Both loaded, but the product is not offered to this store. */
  isMissing: boolean;
  refetch: () => void;
}

function findChannel(
  channels: readonly ProductChannel[] | undefined,
  connectionId: string,
): ProductChannel | undefined {
  return channels?.find((channel) => channel.connection.id === connectionId);
}

/**
 * What the listing editor reads: the product (its values are what the store inherits) and the
 * product's listing in this store (state, store prices, and what the store changes). The listing
 * keeps refetching while it publishes, so the editor shows its state live.
 *
 * Built from today's endpoints; a single per-listing read would replace both queries here
 * without changing the editor.
 */
export function useListingEditor(ref: ProductChannelRef): ListingEditorQuery {
  const product = useProduct(ref.workspaceId, ref.productId);
  const channels = useProductChannels(ref.workspaceId, ref.productId);
  const channel = findChannel(channels.data, ref.connectionId);
  return {
    data: product.data && channel ? { product: product.data, channel } : undefined,
    isPending: product.isPending || channels.isPending,
    error: product.error ?? channels.error,
    isMissing: Boolean(product.data && channels.data && !channel),
    refetch: () => {
      void product.refetch();
      void channels.refetch();
    },
  };
}
