import { CatalogImportMode } from '@/api/schema';
import { pluralize } from '@/lib/format';
import type { CatalogImportResult, ImportJobActor, ImportJobCounts } from './imports.types';

const COUNT_LABELS = {
  created: 'created',
  updated: 'updated',
  skipped: 'skipped',
  failed: 'failed',
} as const satisfies Record<keyof ImportJobCounts, string>;

const NOTHING_IMPORTED = 'Nothing imported';
const DELETED_USER = 'A removed member';
const DELETED_API_KEY = 'A revoked API key';

/** "8 created · 2 failed": the counts that are not zero, in a fixed order. */
export function describeCounts(counts: ImportJobCounts): string {
  const parts = (Object.keys(COUNT_LABELS) as (keyof ImportJobCounts)[])
    .filter((key) => counts[key] > 0)
    .map((key) => `${counts[key].toLocaleString()} ${COUNT_LABELS[key]}`);
  return parts.length > 0 ? parts.join(' · ') : NOTHING_IMPORTED;
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
      return `Imported ${pluralize(result.createdProducts, 'product')} with ${pluralize(result.createdVariants, 'variant')}`;
    case CatalogImportMode.update:
      return `Updated ${pluralize(result.updatedProducts, 'product')}`;
    case CatalogImportMode.inventory:
      return `Set stock for ${pluralize(result.updatedVariants, 'variant')}`;
  }
}
