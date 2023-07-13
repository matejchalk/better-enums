import {
  createEntryGuards,
  createKeyGuards,
  createValueGuards,
} from './guards';
import { BasicEnum, LabeledEnum } from './types';

export function $enum<T extends string | number>(values: T[]): BasicEnum<T>;

export function $enum<const T extends Record<string, string | number>>(
  obj: T
): LabeledEnum<T>;

export function $enum(
  param: (string | number)[] | Record<string, string | number>
) {
  if (Array.isArray(param)) {
    return basicEnum([...param]);
  }
  return labeledEnum(param);
}

function basicEnum<T extends string | number>(values: T[]): BasicEnum<T> {
  return {
    values: () => values,
    ...createValueGuards(values),
  };
}

function labeledEnum<const T extends Record<string, string | number>>(
  obj: T
): LabeledEnum<T> {
  if (
    Object.values(obj).some(value => typeof value === 'string') &&
    Object.values(obj).some(value => typeof value === 'number')
  ) {
    return labeledEnum(
      Object.fromEntries(
        Object.entries(obj).filter(([, value]) => typeof value === 'number')
      ) as T
    );
  }

  const objInverted = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [value, key])
  );

  return {
    ...basicEnum(Object.values(obj) as T[keyof T][]),
    keys: () => Object.keys(obj),
    ...createKeyGuards(Object.keys(obj)),
    entries: () => Object.entries(obj) as any,
    ...createEntryGuards(obj, objInverted),
    obj: Object.freeze(obj),
    keyOf: value => objInverted[value] as any,
  };
}
