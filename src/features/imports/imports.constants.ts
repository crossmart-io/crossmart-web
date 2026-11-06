import {
  CatalogImportFormat,
  CatalogImportMode,
  ImportIssueOutcome,
  ImportJobStatus,
} from '@/api/schema';
import type { ImportJobCounts } from './imports.types';

export const PRODUCT_IMPORTS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/product-imports';
export const IMPORT_JOBS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/import-jobs';
export const IMPORT_JOB_ENDPOINT = '/api/v1/workspaces/{workspaceId}/import-jobs/{jobId}';

/** Exports are plain CSV; some systems label them as Excel. */
export const CSV_FILE_ACCEPT = '.csv,text/csv';
/** Field names of the multipart import form. */
export const IMPORT_FORM_FIELDS = { mode: 'mode', format: 'format', file: 'file' } as const;

/** A sample file the merchant can download and fill in, served from `public/templates`. */
export interface ImportExampleFile {
  href: string;
  fileName: string;
}

const PRODUCTS_EXAMPLE_FILE_NAME = 'crossmart-products-example.csv';
const INVENTORY_EXAMPLE_FILE_NAME = 'crossmart-inventory-example.csv';

export const PRODUCTS_EXAMPLE: ImportExampleFile = {
  href: `/templates/${PRODUCTS_EXAMPLE_FILE_NAME}`,
  fileName: PRODUCTS_EXAMPLE_FILE_NAME,
};

export const INVENTORY_EXAMPLE: ImportExampleFile = {
  href: `/templates/${INVENTORY_EXAMPLE_FILE_NAME}`,
  fileName: INVENTORY_EXAMPLE_FILE_NAME,
};

/** The modes a file upload can use. Channel imports are started from the Channels page. */
export type FileImportMode = Exclude<CatalogImportMode, CatalogImportMode.create_or_link>;

export const DEFAULT_IMPORT_MODE: FileImportMode = CatalogImportMode.create;

interface ImportModeCopy {
  /** Short name, for the mode picker and the history. */
  label: string;
  /** What the history counts for this mode: products, or the rows of a stock sheet. */
  record: string;
}

interface FileImportModeCopy extends ImportModeCopy {
  /** One line under the label in the mode picker. */
  summary: string;
  /** How to get the file, shown above the file input. */
  instructions: string;
  fileLabel: string;
  /** The file format this mode reads. */
  format: CatalogImportFormat;
  example: ImportExampleFile;
}

export const FILE_IMPORT_MODE_COPY: Record<FileImportMode, FileImportModeCopy> = {
  [CatalogImportMode.create]: {
    label: 'Add new products',
    summary: 'Products already in your catalog are left unchanged.',
    instructions:
      'Fill in the example file, or export from Shopify (Products → Export → CSV). One row per variant; rows with the same Handle are one product.',
    fileLabel: 'Product CSV',
    format: CatalogImportFormat.shopify_csv,
    example: PRODUCTS_EXAMPLE,
    record: 'product',
  },
  [CatalogImportMode.update]: {
    label: 'Update existing products',
    summary: 'Changes only the columns in your file. Variants and stock are never removed.',
    instructions:
      'Use the same columns as the example file. Only Handle is required. Leave out a column to keep it; an empty cell clears it. Variants are matched by SKU, then by option values; images stay unless the file lists some.',
    fileLabel: 'Product CSV',
    format: CatalogImportFormat.shopify_csv,
    example: PRODUCTS_EXAMPLE,
    record: 'product',
  },
  [CatalogImportMode.inventory]: {
    label: 'Update stock',
    summary: 'Sets available quantities by SKU from a simple sheet.',
    instructions:
      'A CSV with two columns, sku and available. Only variants that track stock are changed.',
    fileLabel: 'Inventory CSV',
    format: CatalogImportFormat.inventory_csv,
    example: INVENTORY_EXAMPLE,
    record: 'row',
  },
};

export const IMPORT_MODE_COPY: Record<CatalogImportMode, ImportModeCopy> = {
  ...FILE_IMPORT_MODE_COPY,
  [CatalogImportMode.create_or_link]: { label: 'Create or link products', record: 'product' },
};

export const FILE_IMPORT_MODES: readonly FileImportMode[] = [
  CatalogImportMode.create,
  CatalogImportMode.update,
  CatalogImportMode.inventory,
];

/** Where an import read its records from, for the history. */
export const IMPORT_FORMAT_LABELS: Record<CatalogImportFormat, string> = {
  [CatalogImportFormat.shopify_csv]: 'Shopify CSV',
  [CatalogImportFormat.inventory_csv]: 'Inventory CSV',
  [CatalogImportFormat.shopify_api]: 'Shopify store',
};

/** Formats read from a connected channel rather than an uploaded file. */
export const CHANNEL_IMPORT_FORMATS: ReadonlySet<CatalogImportFormat> = new Set([
  CatalogImportFormat.shopify_api,
]);

/** How often a running import is checked for progress. */
export const IMPORT_JOB_POLL_INTERVAL_MS = 1500;

export const IMPORT_JOB_STATUS_LABELS: Record<ImportJobStatus, string> = {
  [ImportJobStatus.PROCESSING]: 'Processing',
  [ImportJobStatus.COMPLETED]: 'Completed',
  [ImportJobStatus.FAILED]: 'Failed',
};

export const IMPORT_ISSUE_OUTCOME_LABELS: Record<ImportIssueOutcome, string> = {
  [ImportIssueOutcome.SKIPPED]: 'Skipped',
  [ImportIssueOutcome.FAILED]: 'Failed',
};

export interface ImportCountLabel {
  key: keyof ImportJobCounts;
  label: string;
}

const FILE_IMPORT_COUNTS: readonly ImportCountLabel[] = [
  { key: 'created', label: 'Created' },
  { key: 'updated', label: 'Updated' },
  { key: 'skipped', label: 'Skipped' },
  { key: 'failed', label: 'Failed' },
];

/** The counts each mode reports, in the order they are shown, in that mode's words. */
export const IMPORT_COUNT_LABELS: Record<CatalogImportMode, readonly ImportCountLabel[]> = {
  [CatalogImportMode.create]: FILE_IMPORT_COUNTS,
  [CatalogImportMode.update]: FILE_IMPORT_COUNTS,
  [CatalogImportMode.inventory]: FILE_IMPORT_COUNTS,
  [CatalogImportMode.create_or_link]: [
    { key: 'created', label: 'Created' },
    { key: 'linked', label: 'Linked' },
    { key: 'updated', label: 'Already linked' },
    { key: 'skipped', label: 'Skipped' },
    { key: 'failed', label: 'Failed' },
  ],
};
