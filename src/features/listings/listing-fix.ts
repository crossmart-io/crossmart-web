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
  /** For `needs_details`: what the server says to fix first, store setup before the product. */
  displayRequirement: PublishRequirement | null | undefined;
  /** What the channel refused the last publish for lacking, when it said. */
  missingRequirement: PublishRequirement | null | undefined;
}

/**
 * What the merchant should fix, or null when there is nothing to fix there (a failure the
 * channel gave no reason for is retried instead). The server names the requirement; a product
 * that needs details without one is sent to its editor.
 */
export function listingFixOf({
  displayState,
  displayRequirement,
  missingRequirement,
}: ListingFixInput): RequirementFix | null {
  const requirement = displayRequirement ?? missingRequirement;
  if (requirement) return PUBLISH_REQUIREMENT_FIXES[requirement];
  return displayState === ListingDisplayState.needs_details ? GENERIC_PRODUCT_FIX : null;
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
