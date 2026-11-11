import { ListingDisplayState, ProductStatus } from '@/api/schema';
import { toApiErrorMessage } from '@/api/api-error';
import { toProductRoute } from '@/config/routes';
import type { ChannelConnection } from '@/features/channels/channels.types';
import { needsReconnect } from '@/features/channels/connection-status';
import { FixTarget } from '@/features/channels/publish-requirements';
import { listingFixOf, listingFixRoute } from './listing-fix';
import type { ProductChannel, ProductSelectionRule } from './listings.types';

/** Whether a store can take a new product now, and how. */
export enum PublishAvailability {
  /** Added in one click with the product. */
  Ready = 'ready',
  /** Its automatic rule takes every active product, so it gets this one without asking. */
  Automatic = 'automatic',
  /** It must be reconnected first. */
  NeedsReconnect = 'needs_reconnect',
}

export interface PublishStore {
  connection: ChannelConnection;
  availability: PublishAvailability;
}

/** A rule with no filter but, at most, "active products": every new active product joins it. */
export function takesEveryActiveProduct(rule: ProductSelectionRule | null): boolean {
  const filter = rule?.filter;
  if (!filter) return false;
  const { status, ...others } = filter;
  const narrowed = Object.values(others).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value),
  );
  return !narrowed && (status === undefined || status === ProductStatus.ACTIVE);
}

export function publishStoreOf(connection: ChannelConnection): PublishStore {
  if (needsReconnect(connection.status)) {
    return { connection, availability: PublishAvailability.NeedsReconnect };
  }
  const automatic = takesEveryActiveProduct(connection.productSelection);
  return {
    connection,
    availability: automatic ? PublishAvailability.Automatic : PublishAvailability.Ready,
  };
}

/** A store that refused the new product, and why, as the API said it. */
export interface PublishFailure {
  storeName: string;
  message: string;
}

export interface PublishResult {
  added: ProductChannel[];
  failures: PublishFailure[];
}

/** Sorts the answers of adding the product to each store into what worked and what did not. */
export function publishResultOf(
  stores: readonly PublishStore[],
  answers: readonly PromiseSettledResult<ProductChannel>[],
): PublishResult {
  const result: PublishResult = { added: [], failures: [] };
  answers.forEach((answer, index) => {
    if (answer.status === 'fulfilled') result.added.push(answer.value);
    else {
      const storeName = stores[index]?.connection.displayName ?? '';
      result.failures.push({ storeName, message: toApiErrorMessage(answer.reason) });
    }
  });
  return result;
}

/**
 * The product's page, opened where a store's missing details are added when one already says
 * so (its listing for a category, the product for a photo); otherwise the plain page, whose
 * Stores card shows each store's state and fix.
 */
export function pageAfterPublish(productId: string, added: readonly ProductChannel[]): string {
  for (const channel of added) {
    if (channel.displayState !== ListingDisplayState.needs_details) continue;
    const fix = listingFixOf({
      displayState: channel.displayState,
      displayRequirement: channel.displayRequirement,
      missingRequirement: channel.listing?.missingRequirement,
    });
    if (fix && (fix.target === FixTarget.StoreOverride || fix.target === FixTarget.ProductEditor)) {
      return listingFixRoute(fix, { productId, connectionId: channel.connection.id });
    }
  }
  return toProductRoute(productId);
}
