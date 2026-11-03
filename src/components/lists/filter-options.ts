/** The value a filter menu holds when it filters nothing. */
export const ANY_VALUE = 'any';

export interface FilterOption<Value extends string> {
  value: Value;
  label: string;
}

/** The options of a menu over an enum, in the order its labels are written. */
export function toFilterOptions<Value extends string>(
  labels: Record<Value, string>,
): FilterOption<Value>[] {
  return (Object.entries(labels) as [Value, string][]).map(([value, label]) => ({ value, label }));
}
