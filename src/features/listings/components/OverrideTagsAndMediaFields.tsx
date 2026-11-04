import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { TagInput } from '@/components/forms/TagInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import type { OverrideFormValues } from '../override-form';

interface OverrideToggleProps {
  name: 'customTags' | 'customMedia';
  id: string;
  label: string;
}

function OverrideToggle({ name, id, label }: OverrideToggleProps) {
  const { control } = useFormContext<OverrideFormValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field orientation="horizontal">
          <Checkbox
            id={id}
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked === true)}
          />
          <FieldLabel htmlFor={id} className="font-normal">
            {label}
          </FieldLabel>
        </Field>
      )}
    />
  );
}

/** Tags for this store instead of the product's, which an empty list clears. */
export function TagsOverrideField() {
  const { control } = useFormContext<OverrideFormValues>();
  const custom = useWatch({ control, name: 'customTags' });
  return (
    <>
      <OverrideToggle
        name="customTags"
        id="override-custom-tags"
        label="Use different tags in this store"
      />
      {custom && (
        <Field>
          <FieldLabel htmlFor="override-tags">Tags in this store</FieldLabel>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagInput id="override-tags" value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>
      )}
    </>
  );
}

/** Which of the product's images this store shows, in the product's order. */
export function MediaOverrideField({ imageUrls }: { imageUrls: readonly string[] }) {
  const { control } = useFormContext<OverrideFormValues>();
  const custom = useWatch({ control, name: 'customMedia' });
  if (imageUrls.length === 0) return null;
  return (
    <>
      <OverrideToggle
        name="customMedia"
        id="override-custom-media"
        label="Show only some images in this store"
      />
      {custom && (
        <Controller
          control={control}
          name="mediaUrls"
          render={({ field }) => (
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-medium">Images in this store</legend>
              <ul className="grid grid-cols-4 gap-2">
                {imageUrls.map((url, index) => {
                  const checked = field.value.includes(url);
                  const id = `override-image-${index}`;
                  return (
                    <li key={url}>
                      <label
                        htmlFor={id}
                        className="relative block cursor-pointer overflow-hidden rounded-md border has-[:checked]:ring-2 has-[:checked]:ring-primary"
                      >
                        <img
                          src={url}
                          // The checkbox names the choice; the picture only shows it.
                          alt=""
                          className="aspect-square w-full object-cover"
                        />
                        <Checkbox
                          id={id}
                          aria-label={`Show picture ${index + 1} of ${imageUrls.length}`}
                          checked={checked}
                          className="absolute top-1.5 left-1.5 bg-background"
                          onCheckedChange={(next) =>
                            field.onChange(
                              imageUrls.filter((candidate) =>
                                candidate === url ? next === true : field.value.includes(candidate),
                              ),
                            )
                          }
                        />
                      </label>
                    </li>
                  );
                })}
              </ul>
              <FieldDescription>The first one chosen is the main image.</FieldDescription>
            </fieldset>
          )}
        />
      )}
    </>
  );
}
