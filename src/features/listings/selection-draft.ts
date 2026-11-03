import type { CatalogGap, ProductStatus } from '@/api/schema';
import { pluralize } from '@/lib/format';
import {
  SELECTION_MODE_LABELS,
  SELECTION_SUMMARY_SEPARATOR,
  SelectionMode,
} from './listings.constants';
import type { ProductSelectionFilter, ProductSelectionRule } from './listings.types';

/** The selection as the editor holds it. */
export interface SelectionDraft {
  mode: SelectionMode;
  search: string;
  status?: ProductStatus;
  gap?: CatalogGap;
  tags: string[];
  vendor: string;
  includeProductIds: string[];
  excludeProductIds: string[];
}

function hasFilters(filter: ProductSelectionFilter): boolean {
  return Boolean(
    filter.search || filter.status || filter.gap || filter.tags?.length || filter.vendor,
  );
}

function modeOf(rule: ProductSelectionRule | null | undefined): SelectionMode {
  if (!rule) return SelectionMode.All;
  if (rule.filter === null) return SelectionMode.Picked;
  return hasFilters(rule.filter) ? SelectionMode.Filtered : SelectionMode.All;
}

/** The filter fields of a stored filter, with "any" as empty values. */
function toFilterFields(
  filter: ProductSelectionFilter,
): Pick<SelectionDraft, 'search' | 'status' | 'gap' | 'tags' | 'vendor'> {
  return {
    search: filter.search ?? '',
    status: filter.status,
    gap: filter.gap,
    tags: filter.tags ?? [],
    vendor: filter.vendor ?? '',
  };
}

export function toSelectionDraft(rule: ProductSelectionRule | null | undefined): SelectionDraft {
  return {
    mode: modeOf(rule),
    ...toFilterFields(rule?.filter ?? {}),
    includeProductIds: rule?.includeProductIds ?? [],
    excludeProductIds: rule?.excludeProductIds ?? [],
  };
}

function toFilter(draft: SelectionDraft): ProductSelectionFilter | null {
  switch (draft.mode) {
    case SelectionMode.All:
      return {};
    case SelectionMode.Picked:
      return null;
    case SelectionMode.Filtered:
      return {
        ...(draft.search.trim() ? { search: draft.search.trim() } : {}),
        ...(draft.status ? { status: draft.status } : {}),
        ...(draft.gap ? { gap: draft.gap } : {}),
        ...(draft.tags.length > 0 ? { tags: draft.tags } : {}),
        ...(draft.vendor.trim() ? { vendor: draft.vendor.trim() } : {}),
      };
  }
}

export function toSelectionRule(draft: SelectionDraft): ProductSelectionRule {
  return {
    filter: toFilter(draft),
    includeProductIds: draft.includeProductIds,
    excludeProductIds: draft.excludeProductIds,
  };
}

/** Removes the product from the selection by hand: out of the picks, into the exclusions. */
export function excludeProduct(draft: SelectionDraft, productId: string): SelectionDraft {
  return {
    ...draft,
    includeProductIds: draft.includeProductIds.filter((id) => id !== productId),
    excludeProductIds:
      draft.mode === SelectionMode.Picked
        ? draft.excludeProductIds
        : [...new Set([...draft.excludeProductIds, productId])],
  };
}

/** Adds the product by hand: into the picks, out of the exclusions. */
export function includeProduct(draft: SelectionDraft, productId: string): SelectionDraft {
  return {
    ...draft,
    includeProductIds: [...new Set([...draft.includeProductIds, productId])],
    excludeProductIds: draft.excludeProductIds.filter((id) => id !== productId),
  };
}

/** The rule after adding or removing one product by hand, as a store's product list does. */
export function toggleProductInRule(
  rule: ProductSelectionRule | null,
  productId: string,
  include: boolean,
): ProductSelectionRule {
  const draft = toSelectionDraft(rule);
  return toSelectionRule(
    include ? includeProduct(draft, productId) : excludeProduct(draft, productId),
  );
}

/** One line for a rule: how products are chosen, and how many were changed by hand. */
export function describeSelection(rule: ProductSelectionRule | null): string {
  const draft = toSelectionDraft(rule);
  const parts: string[] = [SELECTION_MODE_LABELS[draft.mode]];
  if (draft.mode !== SelectionMode.Picked && draft.includeProductIds.length > 0) {
    parts.push(`${pluralize(draft.includeProductIds.length, 'product')} added by hand`);
  }
  if (draft.mode === SelectionMode.Picked) {
    parts.push(pluralize(draft.includeProductIds.length, 'product'));
  }
  if (draft.excludeProductIds.length > 0) {
    parts.push(`${pluralize(draft.excludeProductIds.length, 'product')} removed by hand`);
  }
  return parts.join(SELECTION_SUMMARY_SEPARATOR);
}
