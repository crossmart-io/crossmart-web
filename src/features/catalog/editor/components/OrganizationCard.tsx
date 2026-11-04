import { Controller, useFormContext } from 'react-hook-form';
import { TagInput } from '@/components/forms/TagInput';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import type { ProductFormValues } from '../product-form.schema';
import { EditorCard } from './EditorCard';
import { TextField } from './FormFields';

const TAGS_FIELD_ID = 'tags';

export function OrganizationCard() {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <EditorCard title="Organization">
      <TextField name="productType" label="Type" placeholder="Sweaters" />
      <TextField name="vendor" label="Vendor" placeholder="Your brand or supplier" />
      <Controller
        control={control}
        name="tags"
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor={TAGS_FIELD_ID}>Tags</FieldLabel>
            <TagInput
              id={TAGS_FIELD_ID}
              value={field.value}
              onChange={field.onChange}
              placeholder="Type a tag and press Enter"
            />
            <FieldDescription>Help you find products and build store rules.</FieldDescription>
          </Field>
        )}
      />
    </EditorCard>
  );
}
