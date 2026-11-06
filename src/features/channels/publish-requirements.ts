import { PublishRequirement } from '@/api/schema';
import { PageSection } from '@/config/routes';
import type { ChannelConnection } from './channels.types';

/** Where the merchant goes to give a store what publishing lacks. */
export enum FixTarget {
  /** Connect the store again. */
  Reconnect = 'reconnect',
  /** A card in the store's Settings tab. */
  StoreSettings = 'store_settings',
  /** The product's overrides for this store. */
  StoreOverride = 'store_override',
  /** The product itself, in its editor. */
  ProductEditor = 'product_editor',
}

/** What is missing, in the merchant's words, and the action that fixes it. */
interface FixCopy {
  missing: string;
  action: string;
}

/** A fix, and the card it opens on when it has one. */
export type RequirementFix = FixCopy &
  (
    | { target: FixTarget.Reconnect | FixTarget.StoreOverride; section?: never }
    | { target: FixTarget.StoreSettings | FixTarget.ProductEditor; section: PageSection }
  );

const LISTING_DEFAULTS_ACTION = 'Open listing defaults';
const LISTING_SETUP_ACTION = 'Open listing setup';

export const PUBLISH_REQUIREMENT_FIXES: Record<PublishRequirement, RequirementFix> = {
  [PublishRequirement.reconnect]: {
    missing: 'Reconnect the store',
    action: 'Reconnect',
    target: FixTarget.Reconnect,
  },
  [PublishRequirement.account_settings]: {
    missing: 'Connect the account again so Crossmart can read its settings',
    action: 'Reconnect',
    target: FixTarget.Reconnect,
  },
  [PublishRequirement.shipping_policy]: {
    missing: 'Choose a shipping policy',
    action: LISTING_DEFAULTS_ACTION,
    target: FixTarget.StoreSettings,
    section: PageSection.StoreListingDefaults,
  },
  [PublishRequirement.payment_policy]: {
    missing: 'Choose a payment policy',
    action: LISTING_DEFAULTS_ACTION,
    target: FixTarget.StoreSettings,
    section: PageSection.StoreListingDefaults,
  },
  [PublishRequirement.return_policy]: {
    missing: 'Choose a return policy',
    action: LISTING_DEFAULTS_ACTION,
    target: FixTarget.StoreSettings,
    section: PageSection.StoreListingDefaults,
  },
  [PublishRequirement.ship_from_location]: {
    missing: 'Set where items ship from',
    action: LISTING_DEFAULTS_ACTION,
    target: FixTarget.StoreSettings,
    section: PageSection.StoreListingDefaults,
  },
  [PublishRequirement.listing_setup]: {
    missing: 'Choose the country and the product page address',
    action: LISTING_SETUP_ACTION,
    target: FixTarget.StoreSettings,
    section: PageSection.StoreListingSetup,
  },
  [PublishRequirement.item_details]: {
    missing: 'Say who made the items, and when',
    action: LISTING_SETUP_ACTION,
    target: FixTarget.StoreSettings,
    section: PageSection.StoreListingSetup,
  },
  [PublishRequirement.shipping_profile]: {
    missing: 'Choose a shipping profile',
    action: LISTING_SETUP_ACTION,
    target: FixTarget.StoreSettings,
    section: PageSection.StoreListingSetup,
  },
  [PublishRequirement.processing_profile]: {
    missing: 'Choose a processing profile',
    action: LISTING_SETUP_ACTION,
    target: FixTarget.StoreSettings,
    section: PageSection.StoreListingSetup,
  },
  [PublishRequirement.item_details]: {
    missing: 'Say who made the items, when, and whether they are supplies',
    action: LISTING_DEFAULTS_ACTION,
    target: FixTarget.StoreSettings,
    section: PageSection.StoreListingDefaults,
  },
  [PublishRequirement.shipping_profile]: {
    missing: 'Choose a shipping profile',
    action: LISTING_DEFAULTS_ACTION,
    target: FixTarget.StoreSettings,
    section: PageSection.StoreListingDefaults,
  },
  [PublishRequirement.processing_profile]: {
    missing: 'Choose a processing profile',
    action: LISTING_DEFAULTS_ACTION,
    target: FixTarget.StoreSettings,
    section: PageSection.StoreListingDefaults,
  },
  [PublishRequirement.images]: {
    missing: 'Add a product photo',
    action: 'Add a photo',
    target: FixTarget.ProductEditor,
    section: PageSection.ProductMedia,
  },
  [PublishRequirement.active_product]: {
    missing: 'Set the product to Active',
    action: 'Change status',
    target: FixTarget.ProductEditor,
    section: PageSection.ProductStatus,
  },
  [PublishRequirement.category]: {
    missing: 'Choose a category for this store',
    action: 'Choose a category',
    target: FixTarget.StoreOverride,
  },
  [PublishRequirement.item_specifics]: {
    missing: 'Fill in the required item specifics',
    action: 'Fill in item specifics',
    target: FixTarget.StoreOverride,
  },
  [PublishRequirement.option_names]: {
    missing: 'Name the product’s options',
    action: 'Name the options',
    target: FixTarget.ProductEditor,
    section: PageSection.ProductVariants,
  },
};

/** When a product needs something the API did not name: its editor, at the photos it most often lacks. */
export const GENERIC_PRODUCT_FIX: RequirementFix = {
  missing: 'Complete the product',
  action: 'Edit the product',
  target: FixTarget.ProductEditor,
  section: PageSection.ProductMedia,
};

/** What the "finish setup" alert and the channel card say. */
export const PUBLISH_READINESS_COPY = {
  title: 'Finish setup to publish',
  description: 'Nothing is published to this store until you finish these steps:',
  askAdmin: 'A workspace admin can finish it.',
  cardNote: 'Finish setup to publish',
  cardAction: 'Finish setup',
} as const;

/**
 * What the store's setup still lacks, without `reconnect`: the reconnect alert already says
 * that, so nothing repeats it.
 */
export function missingSetup(connection: ChannelConnection): PublishRequirement[] {
  return connection.publishReadiness.missing.filter(
    (requirement) => requirement !== PublishRequirement.reconnect,
  );
}
