import type { EnumOption } from '@/lib/enum';

/** The value a filter menu holds when it filters nothing. */
export const ANY_VALUE = 'any';

export type FilterOption<Value extends string> = EnumOption<Value>;
