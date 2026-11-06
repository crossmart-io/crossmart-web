/** Up to this many variants, the grid stays one flat list; more are grouped by the first option. */
export const MAX_UNGROUPED_VARIANTS = 10;
/** From this many variants, the grid offers a filter. */
export const MIN_FILTERABLE_VARIANTS = 20;
/** Grouping needs a second option, or every group would hold a single variant. */
export const MIN_OPTIONS_TO_GROUP = 2;

/** The variant fields a bulk edit can set, by their form field name. */
export enum BulkVariantField {
  Price = 'price',
  CompareAtPrice = 'compareAtPrice',
  Quantity = 'quantity',
}

export const BULK_VARIANT_FIELD_LABELS: Record<BulkVariantField, string> = {
  [BulkVariantField.Price]: 'Price',
  [BulkVariantField.CompareAtPrice]: 'Compare-at price',
  [BulkVariantField.Quantity]: 'Available',
};

/** Money fields show the currency; the rest are whole numbers. */
export const BULK_MONEY_FIELDS: ReadonlySet<BulkVariantField> = new Set([
  BulkVariantField.Price,
  BulkVariantField.CompareAtPrice,
]);

/** A row that spans the table, kept a full-width block while the rows are stacked on phones. */
export const GROUP_ROW_CLASSES = {
  row: 'block sm:table-row',
  cell: 'block sm:table-cell',
} as const;

export const VARIANTS_COPY = {
  filterLabel: 'Filter variants',
  filterPlaceholder: 'Filter by option, e.g. Red or XL',
  noMatches: 'No variants match this filter.',
  expandAll: 'Expand all',
  collapseAll: 'Collapse all',
  setForAll: 'Set for all',
  setForShown: 'Set for shown',
  setForGroup: 'Set for this group',
  bulkTitle: 'Set a value for',
  bulkFieldLabel: 'Field to set',
  bulkValueLabel: 'New value',
  bulkClearHint: 'Leave empty to clear it.',
  inStock: 'in stock',
  toFix: 'to fix',
  apply: 'Apply',
} as const;

/** The toast after a bulk edit, e.g. "Price set for 8 variants". */
export function bulkAppliedMessage(fieldLabel: string, countLabel: string): string {
  return `${fieldLabel} set for ${countLabel}`;
}
