import { CatalogGap } from '@/api/schema';

interface CatalogGapCopy {
  /** Filter chip on the product list. */
  label: string;
  /** Line in Catalog health, after the product count. */
  health: string;
}

export const CATALOG_GAP_COPY: Record<CatalogGap, CatalogGapCopy> = {
  [CatalogGap.images]: { label: 'Missing images', health: 'without images' },
  [CatalogGap.description]: { label: 'Missing description', health: 'without a description' },
  [CatalogGap.sku]: { label: 'Missing SKU', health: 'with a variant missing its SKU' },
  [CatalogGap.barcode]: { label: 'Missing barcode', health: 'with a variant missing its barcode' },
  [CatalogGap.out_of_stock]: { label: 'Out of stock', health: 'with a variant out of stock' },
};

export function toCatalogGap(value: string | null): CatalogGap | undefined {
  return Object.values(CatalogGap).find((gap) => gap === value);
}
