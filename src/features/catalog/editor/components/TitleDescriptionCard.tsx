import { Controller, useFormContext } from 'react-hook-form';
import { ContentField } from '@/api/schema';
import { LabelRow } from '@/components/forms/LabelRow';
import { RichTextEditor } from '@/components/forms/RichTextEditor';
import { Card, CardAction, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
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

export function TitleDescriptionCard({ aiTarget }: TitleDescriptionCardProps) {
  const { control } = useFormContext<ProductFormValues>();
  const writer = useProductAiWriter();
  const rewrite = (fields: readonly ContentField[]) =>
    aiTarget && <AiRewriteButton target={aiTarget} fields={fields} {...writer} />;

  return (
    <Card>
      {aiTarget && (
        <CardHeader>
          <CardDescription>{AI_WRITER_COPY.writeAllHint}</CardDescription>
          <CardAction>
            <AiRewriteButton
              target={aiTarget}
              fields={ALL_CONTENT_FIELDS}
              label={AI_WRITER_COPY.writeAll}
              prominent
              {...writer}
            />
          </CardAction>
        </CardHeader>
      )}
      <CardContent className="flex flex-col gap-4">
        <TextField
          name="title"
          label="Title"
          placeholder="Short-sleeve linen shirt"
          maxLength={MAX_TITLE_LENGTH}
          labelAction={rewrite([ContentField.title])}
        />
        <Field>
          <LabelRow action={rewrite([ContentField.description])}>
            <FieldLabel id={DESCRIPTION_LABEL_ID}>Description</FieldLabel>
          </LabelRow>
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
        </Field>
      </CardContent>
    </Card>
  );
}
