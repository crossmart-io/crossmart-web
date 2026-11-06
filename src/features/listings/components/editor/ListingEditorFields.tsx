import { FormError } from '@/components/feedback/FormError';
import { Separator } from '@/components/ui/separator';
import { DescriptionField } from './DescriptionField';
import { ImagesField } from './ImagesField';
import { StoreOnlyFields } from './StoreOnlyFields';
import { TagsField } from './TagsField';
import { TitleField } from './TitleField';
import { VariantPricesField } from './VariantPricesField';
import { StockField, VisibilityField } from './VisibilityAndStockFields';
import { useListingEditorContext } from './listing-editor-context';

/**
 * Every field of the listing, in the order a merchant reads it: what only this store has first,
 * since that is what most often holds a listing back, then content, prices, and stock.
 */
export function ListingEditorFields({ error }: { error: Error | null }) {
  const { readOnly } = useListingEditorContext();
  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      <fieldset disabled={readOnly} className="flex min-w-0 flex-col gap-6">
        <StoreOnlyFields />
        <TitleField />
        <DescriptionField />
        <TagsField />
        <ImagesField />
        <Separator />
        <VariantPricesField />
        <Separator />
        <VisibilityField />
        <StockField />
      </fieldset>
      <FormError error={error} />
    </div>
  );
}
