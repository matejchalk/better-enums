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
    obj: T;
    keyOf: (value: EnumToUnion<T[keyof T]>) => keyof T;
  };

export type ValueOf<T extends BasicEnum<string | number>> = EnumToUnion<
  ReturnType<T['values']>[number]
>;

export type EnumToUnion<T extends string | number> = T extends string
  ? `${T}`
  : T;
