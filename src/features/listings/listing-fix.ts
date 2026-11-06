import { ListingDisplayState, type PublishRequirement } from '@/api/schema';
import {
  toChannelConnectionRoute,
  toProductRoute,
  toProductStoreOverrideRoute,
  withSection,
} from '@/config/routes';
import {
  FixTarget,
  GENERIC_PRODUCT_FIX,
  PUBLISH_REQUIREMENT_FIXES,
  type RequirementFix,
} from '@/features/channels/publish-requirements';
import { ChannelTab } from './channel-tabs';

/** What decides how a product's problem on a store is fixed. */
export interface ListingFixInput {
  displayState: ListingDisplayState;
  /** What the channel refused the last publish for lacking, when it said. */
  missingRequirement: PublishRequirement | null | undefined;
  /** What the store's setup lacks, in order; unknown while the store is loading. */
  storeMissing: readonly PublishRequirement[] | undefined;
}

/**
 * What the merchant should fix, or null when there is nothing to fix there (a failure the
 * channel gave no reason for is retried instead). The listing's own requirement wins; a product
 * that needs details otherwise waits on the store's setup, or else on the product itself.
 */
export function listingFixOf({
  displayState,
  missingRequirement,
  storeMissing,
}: ListingFixInput): RequirementFix | null {
  if (missingRequirement) return PUBLISH_REQUIREMENT_FIXES[missingRequirement];
  if (displayState !== ListingDisplayState.needs_details) return null;
  const [storeRequirement] = storeMissing ?? [];
  return storeRequirement ? PUBLISH_REQUIREMENT_FIXES[storeRequirement] : GENERIC_PRODUCT_FIX;
}

export interface ListingRef {
  productId: string;
  connectionId: string;
}

/** The page where the fix is made, as a link. */
export function listingFixRoute(fix: RequirementFix, { productId, connectionId }: ListingRef) {
  switch (fix.target) {
    case FixTarget.Reconnect:
      return toChannelConnectionRoute(connectionId);
    case FixTarget.StoreSettings:
      return withSection(toChannelConnectionRoute(connectionId, ChannelTab.Settings), fix.section);
    case FixTarget.StoreOverride:
      return toProductStoreOverrideRoute(productId, connectionId);
    case FixTarget.ProductEditor:
      return withSection(toProductRoute(productId), fix.section);
  }
}
