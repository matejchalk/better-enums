export interface BetterEnum {
  <T extends string | number>(values: T[]): BasicEnum<T>;

  <const T extends Record<string, string | number>>(obj: T): LabeledEnum<T>;

  extend<
    TEnum extends BasicEnum<string | number>,
    TExtra extends string | number
  >(
    srcEnum: TEnum,
    extraValues: TExtra[]
  ): BasicEnum<InferValue<TEnum> | TExtra>;

  extend<
    TEnum extends LabeledEnum<Record<string, string | number>>,
    const TExtra extends Record<string, string | number>
  >(
    srcEnum: TEnum,
    extraObj: TExtra
  ): LabeledEnum<Prettify<TEnum['object'] & TExtra>>;

  exclude<
    TEnum extends LabeledEnum<Record<string, string | number>>,
    TKey extends InferKey<TEnum>
  >(
    srcEnum: TEnum,
    keys: TKey[]
  ): LabeledEnum<Prettify<Omit<TEnum['object'], TKey>>>;

  exclude<
    TEnum extends LabeledEnum<Record<string, string | number>>,
    TValue extends InferValue<TEnum>
  >(
    srcEnum: TEnum,
    values: TValue[]
  ): LabeledEnum<
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

  exclude<
    TEnum extends BasicEnum<string | number>,
    TValue extends InferValue<TEnum>
  >(
    srcEnum: TEnum,
    values: TValue[]
  ): BasicEnum<Exclude<InferValue<TEnum>, TValue>>;
}

export type BasicEnum<T extends string | number> = {
  values: () => T[];
  isValue: (value: unknown) => value is T;
  assertValue: (value: unknown) => asserts value is T;
};

export type LabeledEnum<T extends Record<PropertyKey, string | number>> =
  BasicEnum<T[keyof T]> & {
    keys: () => (keyof T)[];
    isKey: (key: unknown) => key is keyof T;
    assertKey: (key: unknown) => asserts key is keyof T;
    entries: () => [keyof T, T[keyof T]][];
    isEntry: (entry: unknown) => entry is [keyof T, T[keyof T]];
    assertEntry: (entry: unknown) => asserts entry is [keyof T, T[keyof T]];
    object: T;
    keyOf: <V extends EnumToUnion<T[keyof T]>>(value: V) => Invert<T>[V];
  };

export type InferValue<T extends BasicEnum<string | number>> = EnumToUnion<
  ReturnType<T['values']>[number]
>;

export type InferKey<T extends LabeledEnum<Record<string, string | number>>> =
  EnumToUnion<ReturnType<T['keys']>[number]>;

export type EnumToUnion<T extends string | number> = T extends string
  ? `${T}`
  : T;

export type Invert<T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T as T[K]]: K;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
