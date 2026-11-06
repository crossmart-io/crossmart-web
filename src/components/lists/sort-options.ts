import { SortDirection } from '@/api/schema';

/** One way to sort a list: a field and a direction, under one label and one URL value. */
export interface SortOption<Field extends string> {
  /** What the URL holds, such as `title-asc`. */
  value: string;
  label: string;
  sort: Field;
  direction: SortDirection;
}

/** The option a URL value names, or the list's first option for a missing or unknown one. */
export function toSortOption<Field extends string>(
  options: readonly [SortOption<Field>, ...SortOption<Field>[]],
  value: string | null,
): SortOption<Field> {
  return options.find((option) => option.value === value) ?? options[0];
}

/** Lists that sort only by when things happened; the field is each list's own timestamp. */
const BY_TIME = 'time';
export type ByTime = typeof BY_TIME;

export const TIME_SORTS: readonly [SortOption<ByTime>, ...SortOption<ByTime>[]] = [
  { value: 'newest', label: 'Newest first', sort: BY_TIME, direction: SortDirection.desc },
  { value: 'oldest', label: 'Oldest first', sort: BY_TIME, direction: SortDirection.asc },
];
