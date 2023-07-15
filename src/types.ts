export type BasicEnum<T extends string | number> = {
  values: () => readonly T[];
  isValue: (value: unknown) => value is T;
  assertValue: (value: unknown) => asserts value is T;
};

export type LabeledEnum<T extends Record<PropertyKey, string | number>> =
  BasicEnum<T[keyof T]> & {
    keys: () => readonly (keyof T)[];
    isKey: (key: unknown) => key is keyof T;
    assertKey: (key: unknown) => asserts key is keyof T;
    entries: () => readonly (readonly [keyof T, T[keyof T]])[];
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

type Invert<T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T as T[K]]: K;
};
