import { useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { ProductFormValues } from './product-form.schema';
import { buildVariantGridView, type VariantGridView } from './variant-groups';

/** Which groups are open. Groups start closed, so a big product opens as a short list. */
function useGroupDisclosure() {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());

  function toggle(value: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  return {
    isExpanded: (value: string) => expanded.has(value),
    toggle,
    expandAll: (values: string[]) => setExpanded(new Set(values)),
    collapseAll: () => setExpanded(new Set()),
  };
}

export interface VariantGroupsState extends VariantGridView {
  /** The first option's name, e.g. "Color", which names the groups. */
  groupOptionName: string;
  query: string;
  setQuery: (query: string) => void;
  isExpanded: (value: string) => boolean;
  toggle: (value: string) => void;
  /** True when every visible group is open. */
  allExpanded: boolean;
  expandAll: () => void;
  collapseAll: () => void;
}

/** The variants grid's layout: groups by the first option, the filter, and which groups are open. */
export function useVariantGroups(): VariantGroupsState {
  const { control } = useFormContext<ProductFormValues>();
  const variants = useWatch({ control, name: 'variants' });
  const options = useWatch({ control, name: 'options' });
  const optionCount = options.filter((option) => option.values.length > 0).length;
  const [query, setQueryState] = useState('');
  const disclosure = useGroupDisclosure();
  const view = useMemo(
    () => buildVariantGridView(variants, optionCount, query),
    [variants, optionCount, query],
  );
  const groupValues = view.groups.map((group) => group.value);

  /** Filtering opens the groups, so every match is in sight. */
  function setQuery(next: string) {
    setQueryState(next);
    if (next.trim() && !query.trim()) {
      disclosure.expandAll(
        buildVariantGridView(variants, optionCount, next).groups.map((group) => group.value),
      );
    }
  }

  return {
    ...view,
    groupOptionName: options[0]?.name ?? '',
    query,
    setQuery,
    isExpanded: disclosure.isExpanded,
    toggle: disclosure.toggle,
    allExpanded: groupValues.every(disclosure.isExpanded),
    expandAll: () => disclosure.expandAll(groupValues),
    collapseAll: disclosure.collapseAll,
  };
}
