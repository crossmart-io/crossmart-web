import { CatalogGap } from '@/api/schema';

interface CatalogGapCopy {
  /** Filter chip on the product list. */
  label: string;
}

export const CATALOG_GAP_COPY: Record<CatalogGap, CatalogGapCopy> = {
  [CatalogGap.images]: { label: 'Missing images' },
  [CatalogGap.description]: { label: 'Missing description' },
  [CatalogGap.sku]: { label: 'Missing SKU' },
  [CatalogGap.barcode]: { label: 'Missing barcode' },
  [CatalogGap.out_of_stock]: { label: 'Out of stock' },
};
