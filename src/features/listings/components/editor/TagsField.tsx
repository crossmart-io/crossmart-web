import { Controller, useFormContext } from 'react-hook-form';
import { TagInput } from '@/components/forms/TagInput';
import { Badge } from '@/components/ui/badge';
import { FieldLabel } from '@/components/ui/field';
import { FORM_EDIT, useListingField } from '../../hooks/useListingField';
import { FieldOrigin, ListingField } from '../../listing-editor';
import { LISTING_EDITOR_COPY, LISTING_FIELD_LABELS } from '../../listings.constants';
import type { OverrideFormValues } from '../../override-form';
import { ChangeForStoreButton } from './ChangeForStoreButton';
import { InheritedField } from './InheritedField';
import { useListingEditorContext } from './listing-editor-context';

const TAGS_INPUT_ID = 'listing-tags';

function TagList({ tags }: { tags: readonly string[] }) {
  if (tags.length === 0) {
    return <span className="text-muted-foreground">{LISTING_EDITOR_COPY.noTags}</span>;
  }
  return (
    <span className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
        </Badge>
      ))}
    </span>
  );
}

/** Tags in this store: the product's, or the store's own, which may be none at all. */
export function TagsField() {
  const { product, readOnly } = useListingEditorContext();
  const { control, setValue } = useFormContext<OverrideFormValues>();
  const { origin, useProductValue } = useListingField(ListingField.Tags, product);
  const changed = origin === FieldOrigin.Store;
  return (
    <InheritedField
      name={LISTING_FIELD_LABELS.tags}
      label={
        changed ? (
          <FieldLabel htmlFor={TAGS_INPUT_ID}>{LISTING_FIELD_LABELS.tags}</FieldLabel>
        ) : (
          <span className="text-sm font-medium">{LISTING_FIELD_LABELS.tags}</span>
        )
      }
      origin={origin}
      productValue={product.tags.join(', ') || LISTING_EDITOR_COPY.noTags}
      onUseProductValue={readOnly ? undefined : useProductValue}
    >
      {changed ? (
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagInput id={TAGS_INPUT_ID} value={field.value} onChange={field.onChange} />
          )}
        />
      ) : (
        <>
          <TagList tags={product.tags} />
          {!readOnly && (
            <ChangeForStoreButton
              name={LISTING_FIELD_LABELS.tags}
              onClick={() => setValue('customTags', true, FORM_EDIT)}
            />
          )}
        </>
      )}
    </InheritedField>
  );
}
