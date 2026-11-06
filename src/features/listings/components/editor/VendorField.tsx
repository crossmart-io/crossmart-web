import { ListingField } from '../../listing-editor';
import { LISTING_EDITOR_COPY } from '../../listings.constants';
import { InheritedTextField } from './InheritedTextField';
import { useListingEditorContext } from './listing-editor-context';

/** The brand this store shows: empty shows, and follows, the product's vendor. */
export function VendorField() {
  const { listing } = useListingEditorContext();
  return (
    <InheritedTextField
      field={ListingField.Vendor}
      productValue={listing.vendor.product}
      emptyProductValue={LISTING_EDITOR_COPY.noVendor}
    />
  );
}
