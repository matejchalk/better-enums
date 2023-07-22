import { create } from './create';
import type {
  BasicEnum,
  BasicEnumExcluded,
  InferKey,
  InferValue,
  LabeledEnum,
  LabeledEnumExcludedByKeys,
  LabeledEnumExcludedByValues,
} from './types';

export function exclude<
  TEnum extends LabeledEnum<Record<string, string | number>>,
  TKey extends InferKey<TEnum>
>(srcEnum: TEnum, keys: TKey[]): LabeledEnumExcludedByKeys<TEnum, TKey>;

export function exclude<
  TEnum extends LabeledEnum<Record<string, string | number>>,
  TValue extends InferValue<TEnum>
>(srcEnum: TEnum, values: TValue[]): LabeledEnumExcludedByValues<TEnum, TValue>;

export function exclude<
  TEnum extends BasicEnum<string | number>,
  TValue extends InferValue<TEnum>
>(srcEnum: TEnum, values: TValue[]): BasicEnumExcluded<TEnum, TValue>;

export function exclude(
  srcEnum:
    | BasicEnum<string | number>
    | LabeledEnum<Record<string, string | number>>,
  items: (string | number)[]
) {
  if ('object' in srcEnum) {
    if (items.every(item => item in srcEnum.object)) {
      return create(
        Object.fromEntries(
          Object.entries(srcEnum.object).filter(([key]) => !items.includes(key))
        )
      );
    }
    return create(
      Object.fromEntries(
        Object.entries(srcEnum.object).filter(
          ([, value]) => !items.includes(value)
        )
      )
    );
  }
  return create(srcEnum.values().filter(value => !items.includes(value)));
}
