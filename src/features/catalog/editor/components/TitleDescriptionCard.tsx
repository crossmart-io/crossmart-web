import { Controller, useFormContext } from 'react-hook-form';
import { RichTextEditor } from '@/components/forms/RichTextEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  AI_WRITER_COPY,
  ALL_CONTENT_FIELDS,
  AiRewriteButton,
  type ContentDraftTarget,
} from '@/features/ai-writer';
import { MAX_TITLE_LENGTH, type ProductFormValues } from '../product-form.schema';
import { useProductAiWriter } from '../useProductAiWriter';
import { TextField } from './FormFields';

const DESCRIPTION_LABEL_ID = 'descriptionHtml-label';

interface TitleDescriptionCardProps {
  /** The saved product to write for; AI is offered only once it exists. */
  aiTarget?: ContentDraftTarget;
}

/** One AI action for both fields; its form takes an instruction such as "shorter". */
function WriteWithAi({ target }: { target: ContentDraftTarget }) {
  const writer = useProductAiWriter();
  return (
    <AiRewriteButton
      target={target}
      fields={ALL_CONTENT_FIELDS}
      label={AI_WRITER_COPY.writeAll}
      {...writer}
    />
  );
}

export function TitleDescriptionCard({ aiTarget }: TitleDescriptionCardProps) {
  const { control } = useFormContext<ProductFormValues>();
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <TextField
          name="title"
          label="Title"
          maxLength={MAX_TITLE_LENGTH}
          labelAction={aiTarget && <WriteWithAi target={aiTarget} />}
        />
        <Field>
          <FieldLabel id={DESCRIPTION_LABEL_ID}>Description</FieldLabel>
          <Controller
            control={control}
            name="descriptionHtml"
            render={({ field }) => (
              <RichTextEditor
                labelledBy={DESCRIPTION_LABEL_ID}
                value={field.value}
                onChange={field.onChange}
                disabled={field.disabled}
              />
            )}
          />
        </Field>
      </CardContent>
    </Card>
  );
}
