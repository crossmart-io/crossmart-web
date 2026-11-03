import { CatalogImportMode } from '@/api/schema';
import { pluralize } from '@/lib/format';
import { IMPORT_COUNT_LABELS, type ImportCountLabel } from './imports.constants';
import type {
  CatalogImportResult,
  ImportJob,
  ImportJobActor,
  ImportJobCounts,
} from './imports.types';

const NOTHING_IMPORTED = 'Nothing imported';
const READING_SOURCE = 'reading the store';
const DELETED_USER = 'A removed member';
const DELETED_API_KEY = 'A revoked API key';

export interface ImportCount extends ImportCountLabel {
  value: number;
}

/** The counts a mode reports, in order, with the words that mode uses for them. */
export function importCountsOf(counts: ImportJobCounts, mode: CatalogImportMode): ImportCount[] {
  return IMPORT_COUNT_LABELS[mode].map((count) => ({ ...count, value: counts[count.key] }));
}

/** "8 created · 2 failed": the counts that are not zero, in a fixed order. */
export function describeCounts(counts: ImportJobCounts, mode: CatalogImportMode): string {
  const parts = importCountsOf(counts, mode)
    .filter((count) => count.value > 0)
    .map((count) => `${count.value.toLocaleString()} ${count.label.toLowerCase()}`);
  return parts.length > 0 ? parts.join(' · ') : NOTHING_IMPORTED;
}

/** How many of the source's records a running import has been through. */
export function processedCount(counts: ImportJobCounts): number {
  return counts.created + counts.linked + counts.updated + counts.skipped + counts.failed;
}

/** "16 of 120 products": how far a running import is, or how far it got. */
export function describeProgress(job: ImportJob, record: string): string {
  const processed = processedCount(job.counts);
  if (processed === 0 && job.totalCount === null) return READING_SOURCE;
  return job.totalCount === null
    ? `${pluralize(processed, record)} so far`
    : `${processed.toLocaleString()} of ${pluralize(job.totalCount, record)}`;
}

/** Who sent the file: a member, or the API key a program used, as the activity log names them. */
export function describeActor(actor: ImportJobActor): string {
  if (actor.apiKeyId) return actor.apiKeyName ? `${actor.apiKeyName} (API key)` : DELETED_API_KEY;
  return actor.userName ?? DELETED_USER;
}

/** The headline of an import's result, in the words of its mode. */
export function describeResult(result: CatalogImportResult): string {
  switch (result.mode) {
    case CatalogImportMode.create:
    case CatalogImportMode.create_or_link:
      return `Imported ${pluralize(result.createdProducts, 'product')} with ${pluralize(result.createdVariants, 'variant')}`;
    case CatalogImportMode.update:
      return `Updated ${pluralize(result.updatedProducts, 'product')}`;
    case CatalogImportMode.inventory:
      return `Set stock for ${pluralize(result.updatedVariants, 'variant')}`;
  }
}
