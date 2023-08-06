import { create } from './create';
import type {
  AnyLabeledEnum,
  AnySimpleEnum,
  EnumPrimitive,
  InferKey,
  InferValue,
  LabeledEnumExcludedByKeys,
  LabeledEnumExcludedByValues,
  SimpleEnumExcluded,
} from './types';

export function exclude<
  TEnum extends AnyLabeledEnum,
  TKey extends InferKey<TEnum>
>(srcEnum: TEnum, keys: TKey[]): LabeledEnumExcludedByKeys<TEnum, TKey>;

export function exclude<
  TEnum extends AnyLabeledEnum,
  TValue extends InferValue<TEnum>
>(srcEnum: TEnum, values: TValue[]): LabeledEnumExcludedByValues<TEnum, TValue>;

export function exclude<
  TEnum extends AnySimpleEnum,
  TValue extends InferValue<TEnum>
>(srcEnum: TEnum, values: TValue[]): SimpleEnumExcluded<TEnum, TValue>;

export function exclude(
  srcEnum: AnySimpleEnum | AnyLabeledEnum,
  items: EnumPrimitive[]
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
