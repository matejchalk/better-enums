import { BasicEnum, LabeledEnum } from './types';

export function $enum<T extends string | number>(values: T[]): BasicEnum<T>;

export function $enum<const T extends Record<PropertyKey, string | number>>(
  obj: T
): LabeledEnum<T>;

export function $enum(
  param: (string | number)[] | Record<PropertyKey, string | number>
) {
  // TODO: implement
  return {} as any;
}
