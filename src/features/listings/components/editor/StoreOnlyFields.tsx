import { ChannelType } from '@/api/schema';
import { ListingEditorSection, LISTING_EDITOR_COPY } from '../../listings.constants';
import { ChannelCategoryField } from '../ChannelCategoryField';
import { ItemSpecificsSection } from '../ItemSpecificsSection';
import { useListingEditorContext } from './listing-editor-context';

/**
 * What only this store has: eBay's category and the item specifics it asks for. The product has
 * no value for them, so they are not inherited; both save at once, apart from the form.
 */
export function StoreOnlyFields() {
  const { listingRef, product, channel } = useListingEditorContext();
  if (channel.connection.channel !== ChannelType.ebay) return null;
  const category = channel.listing?.category ?? null;
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
      <ChannelCategoryField channelRef={listingRef} category={category} />
      <ItemSpecificsSection
        channelRef={listingRef}
        hasCategory={category !== null}
        vendor={product.vendor}
      />
    </section>
  );
}
