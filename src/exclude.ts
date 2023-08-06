import { create } from './create';
import type {
  InferKey,
  InferValue,
  LabeledEnum,
  LabeledEnumExcludedByKeys,
  LabeledEnumExcludedByValues,
  SimpleEnum,
  SimpleEnumExcluded,
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
  TEnum extends SimpleEnum<string | number>,
  TValue extends InferValue<TEnum>
>(srcEnum: TEnum, values: TValue[]): SimpleEnumExcluded<TEnum, TValue>;

export function exclude(
  srcEnum:
    | SimpleEnum<string | number>
    | LabeledEnum<Record<string, string | number>>,
  items: (string | number)[]
) {
  if ('keys' in srcEnum) {
    if (items.every(item => item in srcEnum.accessor)) {
      return create(
        Object.fromEntries(
          Object.entries(srcEnum.accessor).filter(
            ([key]) => !items.includes(key)
          )
        )
      );
    }
    return create(
      Object.fromEntries(
        Object.entries(srcEnum.accessor).filter(
          ([, value]) => !items.includes(value)
        )
      )
    );
  }
  return create(srcEnum.values().filter(value => !items.includes(value)));
}
