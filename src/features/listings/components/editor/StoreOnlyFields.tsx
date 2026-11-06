import { useProduct } from '@/features/catalog';
import { ListingEditorSection, LISTING_EDITOR_COPY } from '../../listings.constants';
import { ChannelCategoryField } from '../ChannelCategoryField';
import { ItemSpecificsSection } from '../ItemSpecificsSection';
import { useListingEditorContext } from './listing-editor-context';

/** The item specifics, with Brand prefilled from the product's vendor once it has loaded. */
function ItemSpecifics({ hasCategory }: { hasCategory: boolean }) {
  const { listingRef } = useListingEditorContext();
  // The listing read has no vendor; the product's page already holds the product in the cache.
  const product = useProduct(listingRef.workspaceId, listingRef.productId);
  return (
    <ItemSpecificsSection
      channelRef={listingRef}
      hasCategory={hasCategory}
      vendor={product.data?.vendor ?? null}
    />
  );
}

/**
 * What only this store has, for channels that have them: eBay's category and the item specifics
 * it asks for. The product has no value for them, so they are not inherited; both save at
 * once, apart from the form.
 */
export function StoreOnlyFields() {
  const { listingRef, listing } = useListingEditorContext();
  const { category, itemSpecifics } = listing;
  if (!category.supported && !itemSpecifics.supported) return null;
  return (
    <section
      id={ListingEditorSection.StoreOnly}
      aria-labelledby={`${ListingEditorSection.StoreOnly}-title`}
      className="flex scroll-mt-4 flex-col gap-4 border-b pb-6"
    >
      <div className="flex flex-col gap-0.5">
        <h3 id={`${ListingEditorSection.StoreOnly}-title`} className="text-sm font-semibold">
          {LISTING_EDITOR_COPY.storeOnly}
        </h3>
        <p className="text-xs text-muted-foreground">{LISTING_EDITOR_COPY.storeOnlyDescription}</p>
      </div>
      {category.supported && (
        <ChannelCategoryField channelRef={listingRef} category={category.value} />
      )}
      {itemSpecifics.supported && <ItemSpecifics hasCategory={category.value !== null} />}
    </section>
  );
}
