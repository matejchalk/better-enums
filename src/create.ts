import {
  createEntryGuards,
  createKeyGuards,
  createValueGuards,
} from './guards';
import type { LabeledEnum, SimpleEnum } from './types';

export function create<T extends string | number>(values: T[]): SimpleEnum<T>;

export function create<const T extends Record<string, string | number>>(
  obj: T
): LabeledEnum<T>;

export function create(
  param: (string | number)[] | Record<string, string | number>
) {
  if (Array.isArray(param)) {
    return createSimpleEnum([...param]);
  }
  return createLabeledEnum(param);
}

function createSimpleEnum<T extends string | number>(
  values: T[]
): SimpleEnum<T> {
  return {
    values: () => values,
    ...createValueGuards(values),
  };
}

function createLabeledEnum<const T extends Record<string, string | number>>(
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
    object: Object.freeze(obj),
    keyOf: value => objInverted[value] as any,
  };
}
