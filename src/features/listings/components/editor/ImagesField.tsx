import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldDescription, FieldLabel } from '@/components/ui/field';
import { FORM_EDIT, useListingField } from '../../hooks/useListingField';
import { FieldOrigin, ListingField } from '../../listing-editor';
import { LISTING_EDITOR_COPY, LISTING_FIELD_LABELS } from '../../listings.constants';
import type { OverrideFormValues } from '../../override-form';
import { ChangeForStoreButton } from './ChangeForStoreButton';
import { InheritedField } from './InheritedField';
import { useListingEditorContext } from './listing-editor-context';

const IMAGES_LABEL_ID = 'listing-images-label';

/** The product's images, small, as the store shows them while it follows the product. */
function ImageStrip({ urls }: { urls: readonly string[] }) {
  return (
    <ul className="grid grid-cols-6 gap-1.5" aria-labelledby={IMAGES_LABEL_ID}>
      {urls.map((url) => (
        <li key={url}>
          {/* The field's label names the images; each one only shows itself. */}
          <img src={url} alt="" className="aspect-square w-full rounded-md border object-cover" />
        </li>
      ))}
    </ul>
  );
}

interface ImagePickerProps {
  urls: readonly string[];
  value: readonly string[];
  onChange: (value: string[]) => void;
}

/** Which of the product's images the store shows, in the product's order. */
function ImagePicker({ urls, value, onChange }: ImagePickerProps) {
  return (
    <ul className="grid grid-cols-4 gap-2" aria-labelledby={IMAGES_LABEL_ID}>
      {urls.map((url, index) => {
        const id = `listing-image-${index}`;
        return (
          <li key={url}>
            <label
              htmlFor={id}
              className="relative block cursor-pointer overflow-hidden rounded-md border has-[:checked]:ring-2 has-[:checked]:ring-primary"
            >
              {/* The checkbox names the choice; the picture only shows it. */}
              <img src={url} alt="" className="aspect-square w-full object-cover" />
              <Checkbox
                id={id}
                aria-label={`Show picture ${index + 1} of ${urls.length}`}
                checked={value.includes(url)}
                className="absolute top-1.5 left-1.5 bg-background"
                onCheckedChange={(next) =>
                  onChange(
                    urls.filter((candidate) =>
                      candidate === url ? next === true : value.includes(candidate),
                    ),
                  )
                }
              />
            </label>
          </li>
        );
      })}
    </ul>
  );
}

/** The images in this store: all of the product's, or the ones chosen for this store. */
export function ImagesField() {
  const { productDefaults, readOnly } = useListingEditorContext();
  const { control, setValue } = useFormContext<OverrideFormValues>();
  const { origin, useProductValue } = useListingField(ListingField.Images, productDefaults);
  const urls = productDefaults.mediaUrls;
  if (urls.length === 0) return null;
  const changed = origin === FieldOrigin.Store;
  return (
    <InheritedField
      name={LISTING_FIELD_LABELS.images}
      label={<FieldLabel id={IMAGES_LABEL_ID}>{LISTING_FIELD_LABELS.images}</FieldLabel>}
      origin={origin}
      productValue={LISTING_EDITOR_COPY.allImages(urls.length)}
      onUseProductValue={readOnly ? undefined : useProductValue}
    >
      {changed ? (
        <>
          <Controller
            control={control}
            name="mediaUrls"
            render={({ field }) => (
              <ImagePicker urls={urls} value={field.value} onChange={field.onChange} />
            )}
          />
          <FieldDescription>{LISTING_EDITOR_COPY.firstImageNote}</FieldDescription>
        </>
      ) : (
        <>
          <ImageStrip urls={urls} />
          {!readOnly && (
            <ChangeForStoreButton
              name={LISTING_FIELD_LABELS.images}
              onClick={() => setValue('customMedia', true, FORM_EDIT)}
            />
          )}
        </>
      )}
    </InheritedField>
  );
}
