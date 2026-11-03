import { ProductStatus, type components } from '@/api/schema';
import type { Product } from '../catalog.types';
import type { OptionFormValues, ProductFormValues, VariantFormValues } from './product-form.schema';
import { emptyVariant } from './variant-sync';

type VariantPayload = components['schemas']['UpdateVariantDto'];
export type ProductPayload = components['schemas']['UpdateProductDto'];

export function emptyProductForm(): ProductFormValues {
  return {
    title: '',
    handle: '',
    descriptionHtml: '',
    status: ProductStatus.DRAFT,
    vendor: '',
    productType: '',
    tags: [],
    media: [],
    options: [],
    variants: [emptyVariant()],
  };
}

/** Option values in the order variants first use them. */
function toOptions(product: Product): OptionFormValues[] {
  return product.optionNames.map((name, index) => ({
    name,
    values: [
      ...new Set(product.variants.map((variant) => variant.optionValues[index] ?? '')),
    ].filter(Boolean),
  }));
}

export function toProductForm(product: Product): ProductFormValues {
  return {
    title: product.title,
    handle: product.handle,
    descriptionHtml: product.descriptionHtml,
    status: product.status,
    vendor: product.vendor ?? '',
    productType: product.productType ?? '',
    tags: product.tags,
    media: product.media.map(({ url, altText }) => ({ url, altText: altText ?? '' })),
    options: toOptions(product),
    variants: product.variants.map((variant) => ({
      id: variant.id,
      optionValues: variant.optionValues,
      sku: variant.sku ?? '',
      barcode: variant.barcode ?? '',
      price: variant.price,
      compareAtPrice: variant.compareAtPrice ?? '',
      cost: variant.cost ?? '',
      weightGrams: variant.weightGrams === null ? '' : String(variant.weightGrams),
      requiresShipping: variant.requiresShipping,
      taxable: variant.taxable,
      outOfStockPolicy: variant.outOfStockPolicy,
      tracked: variant.tracked,
      quantity: String(variant.available),
    })),
  };
}

const orUndefined = (value: string): string | undefined => value.trim() || undefined;

function toVariantPayload(variant: VariantFormValues): VariantPayload {
  return {
    id: variant.id,
    optionValues: variant.optionValues,
    sku: orUndefined(variant.sku),
    barcode: orUndefined(variant.barcode),
    price: variant.price,
    compareAtPrice: orUndefined(variant.compareAtPrice),
    cost: orUndefined(variant.cost),
    weightGrams: variant.weightGrams ? Number.parseInt(variant.weightGrams, 10) : undefined,
    requiresShipping: variant.requiresShipping,
    taxable: variant.taxable,
    outOfStockPolicy: variant.outOfStockPolicy,
    tracked: variant.tracked,
    quantity: Number.parseInt(variant.quantity, 10),
  };
}

/** The API body for both create (no handle and ids yet) and update. */
export function toProductPayload(values: ProductFormValues): ProductPayload {
  return {
    title: values.title,
    handle: values.handle,
    descriptionHtml: values.descriptionHtml,
    status: values.status,
    vendor: orUndefined(values.vendor),
    productType: orUndefined(values.productType),
    tags: values.tags,
    optionNames: values.options.map((option) => option.name),
    media: values.media.map(({ url, altText }) => ({ url, altText: orUndefined(altText) })),
    variants: values.variants.map(toVariantPayload),
  };
}
