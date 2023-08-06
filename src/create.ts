import {
  createEntryGuards,
  createKeyGuards,
  createValueGuards,
} from './guards';
import type {
  EnumPrimitive,
  EnumSource,
  EnumSourceObject,
  LabeledEnum,
  SimpleEnum,
} from './types';

export function create<T extends EnumPrimitive>(values: T[]): SimpleEnum<T>;

export function create<const T extends EnumSourceObject>(
  obj: T
): LabeledEnum<T>;

export function create(source: EnumSource) {
  if (Array.isArray(source)) {
    return createSimpleEnum([...source]);
  }
  return createLabeledEnum(source);
}

function createSimpleEnum<T extends EnumPrimitive>(values: T[]): SimpleEnum<T> {
  return {
    accessor: Object.freeze(
      Object.fromEntries(values.map(value => [value, value])) as { [K in T]: K }
    ),
    values: () => values,
    ...createValueGuards(values),
  };
}

function createLabeledEnum<const T extends EnumSourceObject>(
  obj: T
): LabeledEnum<T> {
  if (
    Object.values(obj).some(value => typeof value === 'string') &&
    Object.values(obj).some(value => typeof value === 'number')
  ) {
    return createLabeledEnum(
      Object.fromEntries(
        Object.entries(obj).filter(([, value]) => typeof value === 'number')
      ) as T
    );
  }

  const objInverted = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [value, key])
  );

  return {
    ...createSimpleEnum(Object.values(obj) as T[keyof T][]),
    keys: () => Object.keys(obj),
    ...createKeyGuards(Object.keys(obj)),
    entries: () => Object.entries(obj) as any,
    ...createEntryGuards(obj, objInverted),
    accessor: Object.freeze(obj),
    keyOf: value => objInverted[value] as any,
  };
}
