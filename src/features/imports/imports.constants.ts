import {
  CatalogImportFormat,
  CatalogImportMode,
  ImportIssueOutcome,
  ImportJobStatus,
} from '@/api/schema';

export const PRODUCT_IMPORTS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/product-imports';
export const IMPORT_JOBS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/import-jobs';
export const IMPORT_JOB_ENDPOINT = '/api/v1/workspaces/{workspaceId}/import-jobs/{jobId}';

export const IMPORT_JOBS_PAGE_SIZE = 20;

/** Exports are plain CSV; some systems label them as Excel. */
export const CSV_FILE_ACCEPT = '.csv,text/csv';
/** Field names of the multipart import form. */
export const IMPORT_FORM_FIELDS = { mode: 'mode', format: 'format', file: 'file' } as const;

/** The header of an inventory CSV. Mirrors the API, which matches it ignoring case. */
export const INVENTORY_CSV_COLUMNS = ['sku', 'available'] as const;
export const INVENTORY_TEMPLATE_FILE_NAME = 'crossmart-inventory.csv';
export const INVENTORY_TEMPLATE_HREF = `data:text/csv;charset=utf-8,${encodeURIComponent(
  `${INVENTORY_CSV_COLUMNS.join(',')}\n`,
)}`;

export const DEFAULT_IMPORT_MODE = CatalogImportMode.create;

export interface ImportModeCopy {
  /** Short name, for the mode picker and the history. */
  label: string;
  /** One line under the label in the mode picker. */
  summary: string;
  /** How to get the file, shown above the file input. */
  instructions: string;
  fileLabel: string;
  /** The file format this mode reads. */
  format: CatalogImportFormat;
  /** What the history counts for this mode: products, or the rows of a stock sheet. */
  record: string;
}

export const IMPORT_MODE_COPY: Record<CatalogImportMode, ImportModeCopy> = {
  [CatalogImportMode.create]: {
    label: 'Add new products',
    summary: 'Products already in your catalog are left unchanged.',
    instructions: 'In Shopify, go to Products → Export and choose CSV.',
    fileLabel: 'Shopify product CSV',
    format: CatalogImportFormat.shopify_csv,
    record: 'product',
  },
  [CatalogImportMode.update]: {
    label: 'Update existing products',
    summary: 'Replaces products with the same handle. Stock is not changed.',
    instructions:
      'Use a Shopify product CSV. Variants are matched by SKU; images stay unless the file lists some.',
    fileLabel: 'Shopify product CSV',
    format: CatalogImportFormat.shopify_csv,
    record: 'product',
  },
  [CatalogImportMode.inventory]: {
    label: 'Update stock',
    summary: 'Sets available quantities by SKU from a simple sheet.',
    instructions:
      'A CSV with two columns, sku and available. Only variants that track stock are changed.',
    fileLabel: 'Inventory CSV',
    format: CatalogImportFormat.inventory_csv,
    record: 'row',
  },
};

export const IMPORT_MODE_OPTIONS = Object.values(CatalogImportMode);

export const IMPORT_JOB_STATUS_LABELS: Record<ImportJobStatus, string> = {
  [ImportJobStatus.PROCESSING]: 'Processing',
  [ImportJobStatus.COMPLETED]: 'Completed',
  [ImportJobStatus.FAILED]: 'Failed',
};

export const IMPORT_ISSUE_OUTCOME_LABELS: Record<ImportIssueOutcome, string> = {
  [ImportIssueOutcome.SKIPPED]: 'Skipped',
  [ImportIssueOutcome.FAILED]: 'Failed',
};
