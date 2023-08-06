import { expectAssignable, expectNotAssignable, expectType } from 'jest-tsd';
import { Enum, InferKey, InferValue, LabeledEnum, SimpleEnum } from '../src';

test('simple enum', () => {
  const STATUSES = Enum(['alive', 'dead']);
  const INFECTED_STATUSES = Enum.extend(STATUSES, ['zombie']);
  type InfectedStatus = InferValue<typeof INFECTED_STATUSES>;

  expectType<SimpleEnum<'alive' | 'dead' | 'zombie'>>(INFECTED_STATUSES);

  void function (status: InfectedStatus) {
    expectType<'alive' | 'dead' | 'zombie'>(status);
  };

  expectType<('alive' | 'dead' | 'zombie')[]>(INFECTED_STATUSES.values());

  void function (status: 'zombie' | 'werewolf') {
    if (INFECTED_STATUSES.hasValue(status)) {
      expectType<'zombie'>(status);
    }
  };

  void function (status: InferValue<typeof STATUSES>) {
    expectAssignable<InfectedStatus>(status);
  };

  expectType<typeof STATUSES>(Enum.extend(STATUSES, []));
});

test('labeled enum', () => {
  const LOCALES = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
  const EXTENDED_LOCALES = Enum.extend(LOCALES, { German: 'de' });
  type ExtendedLocale = InferValue<typeof EXTENDED_LOCALES>;

  expectType<
    LabeledEnum<{
      readonly English: 'en';
      readonly Czech: 'cs';
      readonly Slovak: 'sk';
      readonly German: 'de';
    }>
  >(EXTENDED_LOCALES);

  void function (locale: ExtendedLocale) {
    expectType<'en' | 'cs' | 'sk' | 'de'>(locale);
  };

  void function (label: InferKey<typeof EXTENDED_LOCALES>) {
    expectType<'English' | 'Czech' | 'Slovak' | 'German'>(label);
  };

  void function (locale: InferValue<typeof LOCALES>) {
    expectAssignable<ExtendedLocale>(locale);
  };

  expectType<typeof LOCALES>(Enum.extend(LOCALES, {}));
});

test('labeled enum to simple enum', () => {
  const LOCALES = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
  const EXTENDED_LOCALES = Enum.extend(LOCALES, ['de']);
  type ExtendedLocale = InferValue<typeof EXTENDED_LOCALES>;

  expectType<SimpleEnum<'en' | 'cs' | 'sk' | 'de'>>(EXTENDED_LOCALES);

  void function (locale: ExtendedLocale) {
    expectType<'en' | 'cs' | 'sk' | 'de'>(locale);
  };

  expectNotAssignable<LabeledEnum<any>>(EXTENDED_LOCALES);

  expectType<SimpleEnum<InferValue<typeof LOCALES>>>(Enum.extend(LOCALES, []));
  expectNotAssignable<typeof LOCALES>(Enum.extend(LOCALES, []));
});
