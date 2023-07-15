import { $enum } from './enum';
import type {
  BasicEnum,
  InferKey,
  InferValue,
  LabeledEnum,
  Prettify,
} from './types';

export function $exclude<
  TEnum extends LabeledEnum<Record<string, string | number>>,
  TKey extends InferKey<TEnum>
>(
  srcEnum: TEnum,
  keys: TKey[]
): LabeledEnum<Prettify<Omit<TEnum['object'], TKey>>>;

export function $exclude<
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

export function $exclude<
  TEnum extends BasicEnum<string | number>,
  TValue extends InferValue<TEnum>
>(
  srcEnum: TEnum,
  values: TValue[]
): BasicEnum<Exclude<InferValue<TEnum>, TValue>>;

export function $exclude(
  srcEnum:
    | BasicEnum<string | number>
    | LabeledEnum<Record<string, string | number>>,
  items: (string | number)[]
) {
  if ('object' in srcEnum) {
    if (items.every(item => item in srcEnum.object)) {
      return $enum(
        Object.fromEntries(
          Object.entries(srcEnum.object).filter(([key]) => !items.includes(key))
        )
      );
    }
    return $enum(
      Object.fromEntries(
        Object.entries(srcEnum.object).filter(
          ([, value]) => !items.includes(value)
        )
      )
    );
  }
  return $enum(srcEnum.values().filter(value => !items.includes(value)));
}
