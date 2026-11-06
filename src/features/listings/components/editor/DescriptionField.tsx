import { Controller, useFormContext } from 'react-hook-form';
import { ContentField } from '@/api/schema';
import { RichTextEditor } from '@/components/forms/RichTextEditor';
import { FieldLabel } from '@/components/ui/field';
import { htmlToText } from '@/lib/html-text';
import { FORM_EDIT, useListingField } from '../../hooks/useListingField';
import { FieldOrigin, ListingField } from '../../listing-editor';
import { LISTING_EDITOR_COPY, LISTING_FIELD_LABELS } from '../../listings.constants';
import type { OverrideFormValues } from '../../override-form';
import { ChangeForStoreButton } from './ChangeForStoreButton';
import { ContentRewriteButton } from './ContentRewriteButton';
import { InheritedField } from './InheritedField';
import { useListingEditorContext } from './listing-editor-context';

const DESCRIPTION_LABEL_ID = 'listing-description-label';

/** The product's description as text, a few lines of it; two when `compact`. */
function DescriptionPreview({ html, compact = false }: { html: string; compact?: boolean }) {
  const text = htmlToText(html);
  return (
    <span
      dir="auto"
      className={compact ? 'line-clamp-2' : 'line-clamp-4 text-sm whitespace-pre-line'}
    >
      {text || LISTING_EDITOR_COPY.noDescription}
    </span>
  );
}

/** The description in this store: the product's, or one written for this store. */
export function DescriptionField() {
  const { productDefaults, readOnly } = useListingEditorContext();
  const { control, setValue } = useFormContext<OverrideFormValues>();
  const { origin, useProductValue } = useListingField(ListingField.Description, productDefaults);
  const changed = origin === FieldOrigin.Store;
  return (
    <InheritedField
      name={LISTING_FIELD_LABELS.description}
      label={<FieldLabel id={DESCRIPTION_LABEL_ID}>{LISTING_FIELD_LABELS.description}</FieldLabel>}
      origin={origin}
      productValue={<DescriptionPreview html={productDefaults.descriptionHtml} compact />}
      onUseProductValue={readOnly ? undefined : useProductValue}
      action={<ContentRewriteButton field={ContentField.description} />}
    >
      {changed ? (
        <Controller
          control={control}
          name="descriptionHtml"
          render={({ field }) => (
            <RichTextEditor
              labelledBy={DESCRIPTION_LABEL_ID}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      ) : (
        <>
          <p className="rounded-md bg-muted/40 p-2 text-muted-foreground">
            <DescriptionPreview html={productDefaults.descriptionHtml} />
          </p>
          {!readOnly && (
            <ChangeForStoreButton
              name={LISTING_FIELD_LABELS.description}
              onClick={() => setValue('customDescription', true, FORM_EDIT)}
            />
          )}
        </>
      )}
    </InheritedField>
  );
}
