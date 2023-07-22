/**
 * Core `Enum` object.
 *
 * - Calling it directly (`Enum(...)`) creates an enum.
 * - Also exposes methods for deriving enums from other enums:
 *   - either by adding more values (`Enum.extend(...)`),
 *   - or by removing values (`Enum.exclude(...)`).
 *
 * Each function has different overloads to support creating both basic and labeled enums.
 */
export interface IEnum {
  /**
   * Creates a basic enum from an array of values.
   *
   * @example
   * const ROLE = Enum(['viewer', 'editor', 'owner']);
   *
   * @param values Array of all values.
   * @returns Basic enum object.
   */
  <T extends string | number>(values: T[]): BasicEnum<T>;

  /**
   * Creates a labeled enum from an object.
   *
   * @example
   * const LANGUAGE = Enum({
   *   English: 'English',
   *   Czech: 'Čeština',
   *   Slovak: 'Slovenčina',
   * });
   *
   * @param obj Object mapping keys to values.
   * @returns Labeled enum object.
   */
  <const T extends Record<string, string | number>>(obj: T): LabeledEnum<T>;

  /**
   * Creates a basic enum by adding values to another enum.
   *
   * @example
   * const STATUS = Enum(['alive', 'dead']);
   * const INFECTED_STATUS = Enum.extend(STATUS, ['zombie']);
   *
   * @param srcEnum Source enum object (basic or labeled).
   * @param extraValues Values to be added.
   * @returns Basic enum object.
   */
  extend<
    TEnum extends BasicEnum<string | number>,
    TExtra extends string | number
  >(
    srcEnum: TEnum,
    extraValues: TExtra[]
  ): BasicEnumExtended<TEnum, TExtra>;

  /**
   * Creates a labeled enum by adding keys and values to another enum.
   *
   * @example
   * const LOCALE = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
   * const EXTENDED_LOCALE = Enum.extend(LOCALE, { Spanish: 'es' });
   *
   * @param srcEnum Source labeled enum object.
   * @param extraObj Object with key-value pairs to be added.
   * @returns Labeled enum object.
   */
  extend<
    TEnum extends LabeledEnum<Record<string, string | number>>,
    const TExtra extends Record<string, string | number>
  >(
    srcEnum: TEnum,
    extraObj: TExtra
  ): LabeledEnumExtended<TEnum, TExtra>;

  /**
   * Creates a labeled enum by removing keys from another enum.
   *
   * @example
   * const LEVEL = Enum({ off: 0, warn: 1, error: 2 });
   * const ERROR_LEVEL = Enum.exclude(LEVEL, ['off']);
   *
   * @param srcEnum Source labeled enum object.
   * @param keys Array of keys to remove.
   * @returns Labeled enum object.
   */
  exclude<
    TEnum extends LabeledEnum<Record<string, string | number>>,
    TKey extends InferKey<TEnum>
  >(
    srcEnum: TEnum,
    keys: TKey[]
  ): LabeledEnumExcludedByKeys<TEnum, TKey>;

  /**
   * Creates a labeled enum by removing values from another enum.
   *
   * @example
   * const LEVEL = Enum({ off: 0, warn: 1, error: 2 });
   * const ERROR_LEVEL = Enum.exclude(LEVEL, [0]);
   *
   * @param srcEnum Source labeled enum object.
   * @param values Array of values to remove.
   * @returns Labeled enum object.
   */
  exclude<
    TEnum extends LabeledEnum<Record<string, string | number>>,
    TValue extends InferValue<TEnum>
  >(
    srcEnum: TEnum,
    values: TValue[]
  ): LabeledEnumExcludedByValues<TEnum, TValue>;

  /**
   * Creates a basic enum by removing values from another enum.
   *
   * @example
   * const STATUS = Enum(['pending', 'fulfilled', 'rejected']);
   * const SETTLED_STATUS = Enum.exclude(STATUS, ['pending']);
   *
   * @param srcEnum Source basic enum object.
   * @param values Array of values to remove.
   * @returns Basic enum object.
   */
  exclude<
    TEnum extends BasicEnum<string | number>,
    TValue extends InferValue<TEnum>
  >(
    srcEnum: TEnum,
    values: TValue[]
  ): BasicEnumExcluded<TEnum, TValue>;
}

/**
 * Enum object created from a list of values.
 *
 * A basic enum is more similar to a union than a built-in `enum`.
 * Unlike a {@link LabeledEnum}, no keys are defined for accessing values.
 */
export type BasicEnum<T extends string | number> = {
  /**
   * Lists all values.
   * @returns Array of values (safe to mutate).
   */
  values: () => T[];
  /**
   * Checks if value is contained in enum's set of values.
   * @param value Value with unknown type.
   * @returns Boolean (`true` if valid enum value, otherwise `false`).
   */
  hasValue: (value: unknown) => value is T;
  /**
   * Checks if value is contained in enum's set of values.
   * @param value Value with unknown type.
   * @returns Nothing if valid enum value, throws error if invalid.
   * @throws `RangeError`
   */
  assertValue: (value: unknown) => asserts value is T;
};

/**
 * Enum object created from a map of key-value pairs.
 *
 * A labeled enum is more similar to a built-in `enum`,
 * because it enables using values indirectly via their keys (dot syntax).
 *
 * A labeled enum supports the same methods as a {@link BasicEnum}:
 * - {@link BasicEnum.values}
 * - {@link BasicEnum.hasValue}
 * - {@link BasicEnum.assertValue}
 *
 * Additional methods are also supported for handling keys and key-value pairs.
 */
export type LabeledEnum<T extends Record<PropertyKey, string | number>> =
  BasicEnum<T[keyof T]> & {
    /**
     * Lists all keys.
     * @returns Array of keys (similar to `Object.keys`).
     */
    keys: () => (keyof T)[];
    /**
     * Checks if key is contained in enum's keys.
     * @param key Value with unknown type.
     * @returns Boolean (`true` if valid enum key, otherwise `false`).
     */
    hasKey: (key: unknown) => key is keyof T;
    /**
     * Checks if key is contained in enum's keys.
     * @param key Value with unknown type.
     * @returns Nothing if valid enum key, throws error if invalid.
     * @throws `RangeError`
     */
    assertKey: (key: unknown) => asserts key is keyof T;
    /**
     * Lists all key-value pairs.
     * @returns Array of tuples (similar to `Object.entries`).
     */
    entries: () => [keyof T, T[keyof T]][];
    /**
     * Checks if key-value pair is contained in enum.
     * @param entry Value with unknown type.
     * @returns Nothing if tuple with matching key and value, throws error if invalid.
     */
    hasEntry: (entry: unknown) => entry is [keyof T, T[keyof T]];
    /**
     * Checks if key-value pair is contained in enum.
     * @param entry Value with unknown type.
     * @returns Boolean (`true` if tuple with matching key and value, otherwise `false`).
     * @throws `RangeError`
     */
    assertEntry: (entry: unknown) => asserts entry is [keyof T, T[keyof T]];
    /**
     * Object mapping keys to values (mutations prevented with `Object.freeze`).
     * Can be used to enable for accessing values by keys using dot syntax.
     *
     * @example
     * const LOCALE = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
     * const Locale = LOCALE.object;
     *
     * const locale = Locale.Czech; // locale is 'cs'
     */
    object: T;
    /**
     * Access key for given value.
     * @param value Enum value.
     * @returns Enum key matching given value.
     */
    keyOf: <V extends EnumToUnion<T[keyof T]>>(value: V) => Invert<T>[V];
  };

/**
 * Utility type to infer type of value for a basic or labeled enum.
 *
 * @example
 * const STATUS = Enum(['on', 'off']);
 * type Status = InferValue<typeof STATUS>; // Status is 'on' | 'off'
 *
 * const LOCALE = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
 * type Locale = InferValue<typeof LOCALE>; // Locale is 'en' | 'cs' | 'sk'
 */
export type InferValue<T extends BasicEnum<string | number>> = EnumToUnion<
  ReturnType<T['values']>[number]
>;

/**
 * Utility type to infer type of key for a labeled enum.
 *
 * @example
 * const LOCALE = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
 * type LocaleKey = InferKey<typeof LOCALE>; // Locale is 'English' | 'Czech' | 'Slovak'
 */
export type InferKey<T extends LabeledEnum<Record<string, string | number>>> =
  EnumToUnion<ReturnType<T['keys']>[number]>;

type EnumToUnion<T extends string | number> = T extends string ? `${T}` : T;

type Invert<T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T as T[K]]: K;
};

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type BasicEnumExtended<
  TEnum extends BasicEnum<string | number>,
  TExtra extends string | number
> = BasicEnum<InferValue<TEnum> | TExtra>;

export type LabeledEnumExtended<
  TEnum extends LabeledEnum<Record<string, string | number>>,
  TExtra extends Record<string, string | number>
> = LabeledEnum<Prettify<TEnum['object'] & TExtra>>;

export type BasicEnumExcluded<
  TEnum extends BasicEnum<string | number>,
  TValue extends InferValue<TEnum>
> = BasicEnum<Exclude<InferValue<TEnum>, TValue>>;

export type LabeledEnumExcludedByKeys<
  TEnum extends LabeledEnum<Record<string, string | number>>,
  TKey extends InferKey<TEnum>
> = LabeledEnum<Prettify<Omit<TEnum['object'], TKey>>>;

export type LabeledEnumExcludedByValues<
  TEnum extends LabeledEnum<Record<string, string | number>>,
  TValue extends InferValue<TEnum>
> = LabeledEnum<
  Prettify<
    Pick<
      TEnum['object'],
      {
        [K in keyof TEnum['object']]: TEnum['object'][K] extends TValue
          ? never
          : K;
      }[keyof TEnum['object']]
    >
  >
>;
