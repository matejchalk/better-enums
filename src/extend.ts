import { create } from './create';
import type {
  AnyLabeledEnum,
  AnySimpleEnum,
  EnumPrimitive,
  EnumSource,
  EnumSourceObject,
  LabeledEnumExtended,
  SimpleEnumExtended,
} from './types';

export function extend<
  TEnum extends AnySimpleEnum,
  TExtra extends EnumPrimitive
>(srcEnum: TEnum, extraValues: TExtra[]): SimpleEnumExtended<TEnum, TExtra>;

export function extend<
  TEnum extends AnyLabeledEnum,
  const TExtra extends EnumSourceObject
>(srcEnum: TEnum, extraObj: TExtra): LabeledEnumExtended<TEnum, TExtra>;

export function extend(
  srcEnum: AnySimpleEnum | AnyLabeledEnum,
  extras: EnumSource
) {
  if (Array.isArray(extras)) {
    return create([...srcEnum.values(), ...extras]);
  }
  return create({
    ...('accessor' in srcEnum && srcEnum.accessor),
    ...extras,
  });
}
