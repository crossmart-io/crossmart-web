import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { ContentField } from '@/api/schema';
import { EnumSelectField } from '@/components/forms/EnumSelectField';
import { LabelRow } from '@/components/forms/LabelRow';
import { RichTextEditor } from '@/components/forms/RichTextEditor';
import { MoneyInput } from '@/components/forms/MoneyInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { AiRewriteButton, type ContentDraftTarget } from '@/features/ai-writer';
import { formatAmount } from '@/lib/format';
import { useOverrideAiWriter } from '../hooks/useOverrideAiWriter';
import { VISIBILITY_OPTIONS } from '../listings.constants';
import type { ChannelVariant } from '../listings.types';
import type { OverrideFormValues } from '../override-form';

const DESCRIPTION_LABEL_ID = 'override-description-label';

interface ContentOverrideFieldsProps {
  productTitle: string;
  aiTarget: ContentDraftTarget;
}

export function ContentOverrideFields({ productTitle, aiTarget }: ContentOverrideFieldsProps) {
  const { register, control } = useFormContext<OverrideFormValues>();
  const custom = useWatch({ control, name: 'customDescription' });
  const writer = useOverrideAiWriter();
  const rewrite = (field: ContentField) => (
    <AiRewriteButton target={aiTarget} fields={[field]} {...writer} />
  );
  return (
    <>
      <Field>
        <LabelRow action={rewrite(ContentField.title)}>
          <FieldLabel htmlFor="override-title">Title in this store</FieldLabel>
        </LabelRow>
        <Input id="override-title" placeholder={productTitle} {...register('title')} />
        <FieldDescription>Leave empty to use the product’s title.</FieldDescription>
      </Field>
      <Controller
        control={control}
        name="customDescription"
        render={({ field }) => (
          <Field orientation="horizontal">
            <Checkbox
              id="override-custom-description"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <FieldLabel htmlFor="override-custom-description" className="font-normal">
              Write a different description for this store
            </FieldLabel>
          </Field>
        )}
      />
      {custom && (
        <Field>
          <LabelRow action={rewrite(ContentField.description)}>
            <FieldLabel id={DESCRIPTION_LABEL_ID}>Description in this store</FieldLabel>
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
      )}
    </>
  );
}

export function VisibilityField() {
  const { control } = useFormContext<OverrideFormValues>();
  return (
    <Field>
      <FieldLabel htmlFor="override-visibility">Visibility</FieldLabel>
      <EnumSelectField
        control={control}
        name="visibility"
        id="override-visibility"
        options={VISIBILITY_OPTIONS}
      />
    </Field>
  );
}

export function StockOverrideFields() {
  const { register, formState } = useFormContext<OverrideFormValues>();
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field data-invalid={Boolean(formState.errors.inventoryBuffer)}>
        <FieldLabel htmlFor="override-buffer">Hold back</FieldLabel>
        <Input
          id="override-buffer"
          inputMode="numeric"
          placeholder="0"
          {...register('inventoryBuffer')}
        />
        <FieldDescription>Units this store never sees.</FieldDescription>
        <FieldError errors={[formState.errors.inventoryBuffer]} />
      </Field>
      <Field data-invalid={Boolean(formState.errors.maxQuantity)}>
        <FieldLabel htmlFor="override-max">Show at most</FieldLabel>
        <Input
          id="override-max"
          inputMode="numeric"
          placeholder="No limit"
          {...register('maxQuantity')}
        />
        <FieldError errors={[formState.errors.maxQuantity]} />
      </Field>
    </div>
  );
}

/** A fixed price per variant, ahead of the pricing rule. The rule's price shows as a hint. */
export function PriceOverrideFields({
  variants,
  currency,
}: {
  variants: readonly ChannelVariant[];
  currency: string;
}) {
  const { register, formState } = useFormContext<OverrideFormValues>();
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-sm font-medium">Price in this store</legend>
      {variants.map((variant, index) => (
        <Field
          key={variant.variantId}
          data-invalid={Boolean(formState.errors.prices?.[index]?.price)}
        >
          <FieldLabel htmlFor={`override-price-${index}`} className="font-normal">
            {variant.title}
          </FieldLabel>
          <MoneyInput
            id={`override-price-${index}`}
            currency={currency}
            // The input shows the currency already, so the hint is the bare amount.
            placeholder={formatAmount(variant.price.price, currency)}
            {...register(`prices.${index}.price`)}
          />
          <FieldError errors={[formState.errors.prices?.[index]?.price]} />
        </Field>
      ))}
      <FieldDescription>Leave empty to use the pricing rule.</FieldDescription>
    </fieldset>
  );
}
