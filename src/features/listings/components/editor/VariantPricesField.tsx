import { useFormContext, useWatch } from 'react-hook-form';
import { PriceSource } from '@/api/schema';
import { MoneyInput } from '@/components/forms/MoneyInput';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { formatAmount, formatMoney } from '@/lib/format';
import { FORM_EDIT } from '../../hooks/useListingField';
import { FieldOrigin, VariantPriceField, variantPriceOrigin } from '../../listing-editor';
import { LISTING_EDITOR_COPY } from '../../listings.constants';
import type { ChannelVariant, Product } from '../../listings.types';
import type { OverrideFormValues } from '../../override-form';
import { InheritedField } from './InheritedField';
import { useListingEditorContext } from './listing-editor-context';

type ProductVariant = Product['variants'][number];

/** The product's prices for a variant, in the catalog's currency: "$64.00 · compare-at $80.00". */
function productPrices(variant: ProductVariant | undefined, currency: string): string | undefined {
  if (!variant) return undefined;
  const price = formatMoney(variant.price, currency);
  return variant.compareAtPrice
    ? `${price} · ${LISTING_EDITOR_COPY.compareAtPrice.toLowerCase()} ${formatMoney(variant.compareAtPrice, currency)}`
    : price;
}

/**
 * What an empty field shows: the price the pricing rule gives. Once the store sets a price, the
 * API prices the variant by it, so the rule's price is not known and the field shows none.
 */
function rulePlaceholders(variant: ChannelVariant, currency: string) {
  if (variant.price.source === PriceSource.override) return { price: '', compareAtPrice: '' };
  const { price, compareAtPrice } = variant.price;
  return {
    price: formatAmount(price, currency),
    compareAtPrice: compareAtPrice ? formatAmount(compareAtPrice, currency) : '',
  };
}

interface PriceInputProps {
  index: number;
  field: VariantPriceField;
  label: string;
  currency: string;
  placeholder: string;
}

function PriceInput({ index, field, label, currency, placeholder }: PriceInputProps) {
  const { register, getFieldState, formState } = useFormContext<OverrideFormValues>();
  const name = `prices.${index}.${field}` as const;
  const { error } = getFieldState(name, formState);
  const id = `listing-${field}-${index}`;
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id} className="text-xs font-normal text-muted-foreground">
        {label}
      </FieldLabel>
      <MoneyInput
        id={id}
        currency={currency}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        {...register(name)}
      />
      <FieldError errors={[error]} />
    </Field>
  );
}

interface VariantPriceRowProps {
  variant: ChannelVariant;
  index: number;
  title: string;
}

/** One variant's price and compare-at price in this store, beside the product's. */
function VariantPriceRow({ variant, index, title }: VariantPriceRowProps) {
  const { product, channel, catalogCurrency, readOnly } = useListingEditorContext();
  const { control, setValue } = useFormContext<OverrideFormValues>();
  const entry = useWatch({ control, name: `prices.${index}` });
  const currency = channel.connection.currencyCode;
  const changed = [VariantPriceField.Price, VariantPriceField.CompareAtPrice].some(
    (field) => variantPriceOrigin(entry, field) === FieldOrigin.Store,
  );
  const placeholders = rulePlaceholders(variant, currency);
  const titleId = `listing-variant-${index}`;
  const resetRow = () => {
    setValue(`prices.${index}.price`, '', FORM_EDIT);
    setValue(`prices.${index}.compareAtPrice`, '', FORM_EDIT);
  };
  return (
    <fieldset aria-labelledby={titleId} className="min-w-0">
      <InheritedField
        name={`${title} price`}
        label={
          <span id={titleId} className="text-sm font-medium">
            {title}
          </span>
        }
        origin={changed ? FieldOrigin.Store : FieldOrigin.Product}
        productValue={productPrices(
          product.variants.find(({ id }) => id === variant.variantId),
          catalogCurrency,
        )}
        onUseProductValue={readOnly ? undefined : resetRow}
      >
        <div className="grid grid-cols-2 gap-3">
          <PriceInput
            index={index}
            field={VariantPriceField.Price}
            label={LISTING_EDITOR_COPY.price}
            currency={currency}
            placeholder={placeholders.price}
          />
          <PriceInput
            index={index}
            field={VariantPriceField.CompareAtPrice}
            label={LISTING_EDITOR_COPY.compareAtPrice}
            currency={currency}
            placeholder={placeholders.compareAtPrice}
          />
        </div>
      </InheritedField>
    </fieldset>
  );
}

/** Each variant's price in this store, ahead of the store's pricing rule. */
export function VariantPricesField() {
  const { channel } = useListingEditorContext();
  const { variants } = channel;
  return (
    <section className="flex flex-col gap-4" aria-labelledby="listing-prices">
      <div className="flex flex-col gap-0.5">
        <h3 id="listing-prices" className="text-sm font-semibold">
          {LISTING_EDITOR_COPY.priceLegend}
        </h3>
        <FieldDescription>{LISTING_EDITOR_COPY.priceHint}</FieldDescription>
      </div>
      {variants.map((variant, index) => (
        <VariantPriceRow
          key={variant.variantId}
          variant={variant}
          index={index}
          title={variants.length > 1 ? variant.title : LISTING_EDITOR_COPY.singleVariantPrice}
        />
      ))}
    </section>
  );
}
