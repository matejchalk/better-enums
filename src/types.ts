/**
 * Core `Enum` object.
 *
 * - Calling it directly (`Enum(...)`) creates an enum.
 * - Also exposes methods for deriving enums from other enums:
 *   - either by adding more values (`Enum.extend(...)`),
 *   - or by removing values (`Enum.exclude(...)`).
 *
 * Each function has different overloads to support creating both simple and labeled enums.
 */
export interface IEnum {
  /**
   * Creates a simple enum from an array of values.
   *
   * @example
   * const ROLE = Enum(['viewer', 'editor', 'owner']);
   *
   * @param values Array of all values.
   * @template T Type of values (union of strings or numbers).
   * @returns Simple enum object.
   */
  <T extends EnumPrimitive>(values: T[]): SimpleEnum<T>;

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
   * @template T Object type (defining types of keys and correspoding values).
   * @returns Labeled enum object.
   */
  <const T extends EnumSourceObject>(obj: T): LabeledEnum<T>;

  /**
   * Creates a simple enum by adding values to another enum.
   *
   * @example
   * const STATUS = Enum(['alive', 'dead']);
   * const INFECTED_STATUS = Enum.extend(STATUS, ['zombie']);
   *
   * @param srcEnum Source enum object (simple or labeled).
   * @param extraValues Values to be added.
   * @template TEnum Type of simple enum or labeled enum.
   * @template TExtra Type of added values (union of strings or numbers).
   * @returns Simple enum object.
   */
  extend<TEnum extends AnySimpleEnum, TExtra extends EnumPrimitive>(
    srcEnum: TEnum,
    extraValues: TExtra[]
  ): SimpleEnumExtended<TEnum, TExtra>;

  /**
   * Creates a labeled enum by adding keys and values to another enum.
   *
   * @example
   * const LOCALE = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
   * const EXTENDED_LOCALE = Enum.extend(LOCALE, { Spanish: 'es' });
   *
   * @param srcEnum Source labeled enum object.
   * @param extraObj Object with key-value pairs to be added.
   * @template TEnum Type of labeled enum.
   * @template TExtra Object type (defining types of added keys and correspoding values).
   * @returns Labeled enum object.
   */
  extend<TEnum extends AnyLabeledEnum, const TExtra extends EnumSourceObject>(
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
   * @template TEnum Type of labeled enum.
   * @template TKey Type of keys to be removed.
   * @returns Labeled enum object.
   */
  exclude<TEnum extends AnyLabeledEnum, TKey extends InferKey<TEnum>>(
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
   * @template TEnum Type of labeled enum.
   * @template TValue Type of values to be removed.
   * @returns Labeled enum object.
   */
  exclude<TEnum extends AnyLabeledEnum, TValue extends InferValue<TEnum>>(
    srcEnum: TEnum,
    values: TValue[]
  ): LabeledEnumExcludedByValues<TEnum, TValue>;

  /**
   * Creates a simple enum by removing values from another enum.
   *
   * @example
   * const STATUS = Enum(['pending', 'fulfilled', 'rejected']);
   * const SETTLED_STATUS = Enum.exclude(STATUS, ['pending']);
   *
   * @param srcEnum Source simple enum object.
   * @param values Array of values to remove.
   * @template TEnum Type of simple enum.
   * @template TValue Type of values to be removed.
   * @returns Simple enum object.
   */
  exclude<TEnum extends AnySimpleEnum, TValue extends InferValue<TEnum>>(
    srcEnum: TEnum,
    values: TValue[]
  ): SimpleEnumExcluded<TEnum, TValue>;
}

/**
 * Enum object created from a list of values.
 *
 * A simple enum is more similar to a union than a built-in `enum`.
 * Unlike a {@link LabeledEnum}, no keys are defined for accessing values.
 *
 * @template T Type of value (union of strings or numbers).
 */
export type SimpleEnum<T extends EnumPrimitive> = {
  /**
   * Object mapping keys to values (mutations prevented with `Object.freeze`).
   * Can be used for accessing values by keys using dot syntax.
   * Unlike with labeled enums, a key and its value will always be exactly the same.
   *
   * @example
   * const STATUS = Enum(['pending', 'fulfilled', 'rejected']);
   * const Status = STATUS.accessor;
   *
   * const status = Status.pending; // status is 'pending'
   */
  accessor: { readonly [K in T]: K };
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
 * A labeled enum supports the same methods as a {@link SimpleEnum}:
 * - {@link SimpleEnum.values}
 * - {@link SimpleEnum.hasValue}
 * - {@link SimpleEnum.assertValue}
 *
 * Additional methods are also supported for handling keys and key-value pairs.
 *
 * @template T Object type (defining types of keys and correspoding values).
 */
export type LabeledEnum<T extends EnumSourceObject> = Omit<
  SimpleEnum<T[keyof T]>,
  'accessor'
> & {
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
   * const Locale = LOCALE.accessor;
   *
   * const locale = Locale.Czech; // locale is 'cs'
   */
  accessor: T;
  /**
   * Access key for given value.
   * @param value Enum value.
   * @returns Enum key matching given value.
   */
  keyOf: <V extends EnumToUnion<T[keyof T]>>(value: V) => Invert<T>[V];
};

/**
 * Utility type to infer type of value for a simple or labeled enum.
 *
 * @example
 * const STATUS = Enum(['on', 'off']);
 * type Status = InferValue<typeof STATUS>; // Status is 'on' | 'off'
 *
 * const LOCALE = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
 * type Locale = InferValue<typeof LOCALE>; // Locale is 'en' | 'cs' | 'sk'
 *
 * @template T Type of simple enum or labeled enum.
 */
export type InferValue<T extends AnySimpleEnum | AnyLabeledEnum> = EnumToUnion<
  ReturnType<T['values']>[number]
>;

/**
 * Utility type to infer type of key for a labeled enum.
 *
 * @example
 * const LOCALE = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
 * type LocaleKey = InferKey<typeof LOCALE>; // Locale is 'English' | 'Czech' | 'Slovak'
 *
 * @template T Type of labeled enum.
 */
export type InferKey<T extends AnyLabeledEnum> = EnumToUnion<
  ReturnType<T['keys']>[number]
>;

type EnumToUnion<T extends EnumPrimitive> = T extends string ? `${T}` : T;

type Invert<T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T as T[K]]: K;
};

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type EnumPrimitive = string | number;
export type EnumSourceObject = Record<EnumPrimitive, EnumPrimitive>;
export type EnumSource = EnumPrimitive[] | EnumSourceObject;

export type AnySimpleEnum = SimpleEnum<EnumPrimitive>;
export type AnyLabeledEnum = LabeledEnum<EnumSourceObject>;

export type SimpleEnumExtended<
  TEnum extends AnySimpleEnum,
  TExtra extends EnumPrimitive
> = SimpleEnum<InferValue<TEnum> | TExtra>;

export type LabeledEnumExtended<
  TEnum extends AnyLabeledEnum,
  TExtra extends EnumSourceObject
> = LabeledEnum<Prettify<TEnum['accessor'] & TExtra>>;

export type SimpleEnumExcluded<
  TEnum extends AnySimpleEnum,
  TValue extends InferValue<TEnum>
> = SimpleEnum<Exclude<InferValue<TEnum>, TValue>>;

export type LabeledEnumExcludedByKeys<
  TEnum extends AnyLabeledEnum,
  TKey extends InferKey<TEnum>
> = LabeledEnum<Prettify<Omit<TEnum['accessor'], TKey>>>;

export type LabeledEnumExcludedByValues<
  TEnum extends AnyLabeledEnum,
  TValue extends InferValue<TEnum>
> = LabeledEnum<
  Prettify<
    Pick<
      TEnum['accessor'],
      {
        [K in keyof TEnum['accessor']]: TEnum['accessor'][K] extends TValue
          ? never
          : K;
      }[keyof TEnum['accessor']]
    >
  >
>;
