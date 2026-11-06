/** A TypeScript string enum, such as the ones `pnpm api:generate` writes. */
type StringEnum = Record<string, string>;

/** One choice of a menu over an enum, with the label the user reads. */
export interface EnumOption<Value extends string> {
  value: Value;
  label: string;
}

/** The options of a menu over an enum, in the order its labels are written. */
export function toEnumOptions<Value extends string>(
  labels: Record<Value, string>,
): EnumOption<Value>[] {
  return (Object.entries(labels) as [Value, string][]).map(([value, label]) => ({ value, label }));
}

/** Whether `value` is one of the enum's values, such as a search param the user may have edited. */
export function isEnumValue<Enum extends StringEnum>(
  enumObject: Enum,
  value: unknown,
): value is Enum[keyof Enum] {
  return typeof value === 'string' && Object.values<string>(enumObject).includes(value);
}

/** The enum value `value` names, or `undefined` for anything else. */
export function parseEnum<Enum extends StringEnum>(
  enumObject: Enum,
  value: unknown,
): Enum[keyof Enum] | undefined {
  return isEnumValue(enumObject, value) ? value : undefined;
}

/** The option whose value is `value`, so a menu's string becomes a typed value without a cast. */
export function findOptionValue<Value extends string>(
  options: readonly EnumOption<Value>[],
  value: string,
): Value | undefined {
  return options.find((option) => option.value === value)?.value;
}
