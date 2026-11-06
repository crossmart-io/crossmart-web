import { useFormContext } from 'react-hook-form';
import { ContentField } from '@/api/schema';
import { FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useListingField } from '../../hooks/useListingField';
import { ListingField } from '../../listing-editor';
import { LISTING_FIELD_LABELS } from '../../listings.constants';
import type { OverrideFormValues } from '../../override-form';
import { ContentRewriteButton } from './ContentRewriteButton';
import { InheritedField } from './InheritedField';
import { useListingEditorContext } from './listing-editor-context';

const TITLE_INPUT_ID = 'listing-title';

/** The title in this store: empty shows, and follows, the product's title. */
export function TitleField() {
  const { product, readOnly } = useListingEditorContext();
  const { register } = useFormContext<OverrideFormValues>();
  const { origin, useProductValue } = useListingField(ListingField.Title, product);
  return (
    <InheritedField
      name={LISTING_FIELD_LABELS.title}
      label={<FieldLabel htmlFor={TITLE_INPUT_ID}>{LISTING_FIELD_LABELS.title}</FieldLabel>}
      origin={origin}
      productValue={product.title}
      onUseProductValue={readOnly ? undefined : useProductValue}
      action={<ContentRewriteButton field={ContentField.title} />}
    >
      <Input id={TITLE_INPUT_ID} dir="auto" placeholder={product.title} {...register('title')} />
    </InheritedField>
  );
}
