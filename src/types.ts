export interface BetterEnum {
  <T extends string | number>(values: T[]): BasicEnum<T>;

  <const T extends Record<string, string | number>>(obj: T): LabeledEnum<T>;

  extend<
    TEnum extends BasicEnum<string | number>,
    TExtra extends string | number
  >(
    srcEnum: TEnum,
    extraValues: TExtra[]
  ): BasicEnumExtended<TEnum, TExtra>;

  extend<
    TEnum extends LabeledEnum<Record<string, string | number>>,
    const TExtra extends Record<string, string | number>
  >(
    srcEnum: TEnum,
    extraObj: TExtra
  ): LabeledEnumExtended<TEnum, TExtra>;

  exclude<
    TEnum extends LabeledEnum<Record<string, string | number>>,
    TKey extends InferKey<TEnum>
  >(
    srcEnum: TEnum,
    keys: TKey[]
  ): LabeledEnumExcludedByKeys<TEnum, TKey>;

  exclude<
    TEnum extends LabeledEnum<Record<string, string | number>>,
    TValue extends InferValue<TEnum>
  >(
    srcEnum: TEnum,
    values: TValue[]
  ): LabeledEnumExcludedByValues<TEnum, TValue>;

  exclude<
    TEnum extends BasicEnum<string | number>,
    TValue extends InferValue<TEnum>
  >(
    srcEnum: TEnum,
    values: TValue[]
  ): BasicEnumExcluded<TEnum, TValue>;
}

export type BasicEnum<T extends string | number> = {
  values: () => T[];
  hasValue: (value: unknown) => value is T;
  assertValue: (value: unknown) => asserts value is T;
};

export type LabeledEnum<T extends Record<PropertyKey, string | number>> =
  BasicEnum<T[keyof T]> & {
    keys: () => (keyof T)[];
    hasKey: (key: unknown) => key is keyof T;
    assertKey: (key: unknown) => asserts key is keyof T;
    entries: () => [keyof T, T[keyof T]][];
    hasEntry: (entry: unknown) => entry is [keyof T, T[keyof T]];
    assertEntry: (entry: unknown) => asserts entry is [keyof T, T[keyof T]];
    object: T;
    keyOf: <V extends EnumToUnion<T[keyof T]>>(value: V) => Invert<T>[V];
  };

export type InferValue<T extends BasicEnum<string | number>> = EnumToUnion<
  ReturnType<T['values']>[number]
>;

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
