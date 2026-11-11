import { ListingField } from '../../listing-editor';
import { InheritedTextField } from './InheritedTextField';
import { useListingEditorContext } from './listing-editor-context';

/** The title in this store: empty shows, and follows, the product's title. */
export function TitleField() {
  const { listing } = useListingEditorContext();
  return <InheritedTextField field={ListingField.Title} productValue={listing.title.product} />;
}
