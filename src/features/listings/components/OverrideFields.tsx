import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { RichTextEditor } from '@/components/forms/RichTextEditor';
import { MoneyInput } from '@/components/forms/MoneyInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatMoney } from '@/lib/format';
import { VISIBILITY_OPTIONS, type VisibilityChoice } from '../listings.constants';
import type { ChannelVariant } from '../listings.types';
import type { OverrideFormValues } from '../override-form';

const DESCRIPTION_LABEL_ID = 'override-description-label';

export function ContentOverrideFields({ productTitle }: { productTitle: string }) {
  const { register, control } = useFormContext<OverrideFormValues>();
  const custom = useWatch({ control, name: 'customDescription' });
  return (
    <>
      <Field>
        <FieldLabel htmlFor="override-title">Title in this store</FieldLabel>
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
          <FieldLabel id={DESCRIPTION_LABEL_ID}>Description in this store</FieldLabel>
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
      <Controller
        control={control}
        name="visibility"
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => field.onChange(value as VisibilityChoice)}
          >
            <SelectTrigger id="override-visibility" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
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
            placeholder={formatMoney(variant.price.price, currency)}
            {...register(`prices.${index}.price`)}
          />
          <FieldError errors={[formState.errors.prices?.[index]?.price]} />
        </Field>
      ))}
      <FieldDescription>Leave empty to use the pricing rule.</FieldDescription>
    </fieldset>
  );
}
