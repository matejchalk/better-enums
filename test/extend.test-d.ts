import { expectAssignable, expectNotAssignable, expectType } from 'jest-tsd';
import {
  $enum,
  $extend,
  BasicEnum,
  InferKey,
  InferValue,
  LabeledEnum,
} from '../src';

test('basic enum', () => {
  const STATUS = $enum(['alive', 'dead']);
  const INFECTED_STATUS = $extend(STATUS, ['zombie']);
  type InfectedStatus = InferValue<typeof INFECTED_STATUS>;

  expectType<BasicEnum<'alive' | 'dead' | 'zombie'>>(INFECTED_STATUS);

  void function (status: InfectedStatus) {
    expectType<'alive' | 'dead' | 'zombie'>(status);
  };

  expectType<readonly ('alive' | 'dead' | 'zombie')[]>(
    INFECTED_STATUS.values()
  );

  void function (status: 'zombie' | 'werewolf') {
    if (INFECTED_STATUS.isValue(status)) {
      expectType<'zombie'>(status);
    }
  };

  void function (status: InferValue<typeof STATUS>) {
    expectAssignable<InfectedStatus>(status);
  };

  expectType<typeof STATUS>($extend(STATUS, []));
});

test('labeled enum', () => {
  const LOCALE = $enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
  const EXTENDED_LOCALE = $extend(LOCALE, { German: 'de' });
  type ExtendedLocale = InferValue<typeof EXTENDED_LOCALE>;

  expectType<
    LabeledEnum<{
      readonly English: 'en';
      readonly Czech: 'cs';
      readonly Slovak: 'sk';
      readonly German: 'de';
    }>
  >(EXTENDED_LOCALE);

  void function (locale: ExtendedLocale) {
    expectType<'en' | 'cs' | 'sk' | 'de'>(locale);
  };

  void function (label: InferKey<typeof EXTENDED_LOCALE>) {
    expectType<'English' | 'Czech' | 'Slovak' | 'German'>(label);
  };

  void function (locale: InferValue<typeof LOCALE>) {
    expectAssignable<ExtendedLocale>(locale);
  };

  expectType<typeof LOCALE>($extend(LOCALE, {}));
});

test('labeled enum to basic enum', () => {
  const LOCALE = $enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
  const EXTENDED_LOCALE = $extend(LOCALE, ['de']);
  type ExtendedLocale = InferValue<typeof EXTENDED_LOCALE>;

  expectType<BasicEnum<'en' | 'cs' | 'sk' | 'de'>>(EXTENDED_LOCALE);

  void function (locale: ExtendedLocale) {
    expectType<'en' | 'cs' | 'sk' | 'de'>(locale);
  };

  expectNotAssignable<LabeledEnum<any>>(EXTENDED_LOCALE);

  expectType<BasicEnum<InferValue<typeof LOCALE>>>($extend(LOCALE, []));
  expectNotAssignable<typeof LOCALE>($extend(LOCALE, []));
});
