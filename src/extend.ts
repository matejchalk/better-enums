import { create } from './create';
import type {
  LabeledEnum,
  LabeledEnumExtended,
  SimpleEnum,
  SimpleEnumExtended,
} from './types';

export function extend<
  TEnum extends SimpleEnum<string | number>,
  TExtra extends string | number
>(srcEnum: TEnum, extraValues: TExtra[]): SimpleEnumExtended<TEnum, TExtra>;

export function extend<
  TEnum extends LabeledEnum<Record<string, string | number>>,
  const TExtra extends Record<string, string | number>
>(srcEnum: TEnum, extraObj: TExtra): LabeledEnumExtended<TEnum, TExtra>;

export function extend(
  srcEnum:
    | SimpleEnum<string | number>
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
