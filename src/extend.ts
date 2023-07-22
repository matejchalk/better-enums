import { create } from './create';
import type { BasicEnum, InferValue, LabeledEnum, Prettify } from './types';

export function extend<
  TEnum extends BasicEnum<string | number>,
  TExtra extends string | number
>(srcEnum: TEnum, extraValues: TExtra[]): BasicEnum<InferValue<TEnum> | TExtra>;

export function extend<
  TEnum extends LabeledEnum<Record<string, string | number>>,
  const TExtra extends Record<string, string | number>
>(
  srcEnum: TEnum,
  extraObj: TExtra
): LabeledEnum<Prettify<TEnum['object'] & TExtra>>;

export function extend(
  srcEnum:
    | BasicEnum<string | number>
    | LabeledEnum<Record<string, string | number>>,
  extras: (string | number)[] | Record<string, string | number>
) {
  if (Array.isArray(extras)) {
    return create([...srcEnum.values(), ...extras]);
  }
  return create({
    ...('object' in srcEnum && srcEnum.object),
    ...extras,
  });
}
