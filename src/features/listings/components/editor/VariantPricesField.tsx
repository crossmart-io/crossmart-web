import { useFormContext, useWatch } from 'react-hook-form';
import { MoneyInput } from '@/components/forms/MoneyInput';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { formatAmount, formatMoney } from '@/lib/format';
import { FORM_EDIT } from '../../hooks/useListingField';
import { FieldOrigin, VariantPriceField, variantPriceOrigin } from '../../listing-editor';
import { LISTING_EDITOR_COPY } from '../../listings.constants';
import { useRulePrices } from '../../hooks/usePreviews';
import type { ListingEditorVariant } from '../../listings.types';
import type { OverrideFormValues } from '../../override-form';
import { InheritedField } from './InheritedField';
import { useListingEditorContext } from './listing-editor-context';

/** The product's prices for a variant, in the catalog's currency: "$64.00 · compare-at $80.00". */
function productPrices(variant: ListingEditorVariant, currency: string): string {
  const price = formatMoney(variant.price.product, currency);
  const compareAt = variant.compareAtPrice.product;
  return compareAt
    ? `${price} · ${LISTING_EDITOR_COPY.compareAtPrice.toLowerCase()} ${formatMoney(compareAt, currency)}`
    : price;
}

/**
 * What an empty field shows: the price the store gets without its own price. For a variant
 * that has one, that is the pricing rule's, looked up apart; until then the field shows none.
 */
function placeholdersOf(
  variant: ListingEditorVariant,
  rulePrice: string | undefined,
  currency: string,
) {
  const price = variant.price.overridden ? rulePrice : variant.price.effective;
  const compareAt = variant.compareAtPrice.overridden ? null : variant.compareAtPrice.effective;
  return {
    price: price ? formatAmount(price, currency) : '',
    compareAtPrice: compareAt ? formatAmount(compareAt, currency) : '',
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
  variant: ListingEditorVariant;
  index: number;
  title: string;
  /** What the pricing rule charges for the variant, in the store's currency, once known. */
  rulePrice: string | undefined;
}

/** One variant's price and compare-at price in this store, beside the product's and the rule's. */
function VariantPriceRow({ variant, index, title, rulePrice }: VariantPriceRowProps) {
  const { listing, catalogCurrency, readOnly } = useListingEditorContext();
  const { control, setValue } = useFormContext<OverrideFormValues>();
  const entry = useWatch({ control, name: `prices.${index}` });
  const currency = listing.connection.currencyCode;
  const changed = [VariantPriceField.Price, VariantPriceField.CompareAtPrice].some(
    (field) => variantPriceOrigin(entry, field) === FieldOrigin.Store,
  );
  const placeholders = placeholdersOf(variant, rulePrice, currency);
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
        productValue={productPrices(variant, catalogCurrency)}
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
        {changed && rulePrice && (
          <p className="text-xs text-muted-foreground">
            {LISTING_EDITOR_COPY.rulePrice(formatMoney(rulePrice, currency))}
          </p>
        )}
      </InheritedField>
    </fieldset>
  );
}

/** Each variant's price in this store, ahead of the store's pricing rule. */
export function VariantPricesField() {
  const { listingRef, listing } = useListingEditorContext();
  const { variants } = listing;
  const hasOwnPrice = variants.some((variant) => variant.price.overridden);
  const rulePrices = useRulePrices(listingRef, hasOwnPrice);
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
          rulePrice={rulePrices?.get(variant.variantId)}
        />
      ))}
    </section>
  );
}
