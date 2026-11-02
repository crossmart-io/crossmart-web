import { Controller, useFormContext } from 'react-hook-form';
import { RichTextEditor } from '@/components/forms/RichTextEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import type { ProductFormValues } from '../product-form.schema';
import { TextField } from './FormFields';

const DESCRIPTION_FIELD_ID = 'descriptionHtml';

export function TitleDescriptionCard() {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <TextField name="title" label="Title" placeholder="Short-sleeve linen shirt" />
        <Field>
          <FieldLabel htmlFor={DESCRIPTION_FIELD_ID}>Description</FieldLabel>
          <Controller
            control={control}
            name="descriptionHtml"
            render={({ field }) => (
              <RichTextEditor
                id={DESCRIPTION_FIELD_ID}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Field>
      </CardContent>
    </Card>
  );
}
