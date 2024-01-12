import { expect, test } from 'tstyche';
import { Enum, InferKey, InferValue, LabeledEnum, SimpleEnum } from '../src';

test('simple enum', () => {
  const STATUSES = Enum(['alive', 'dead']);
  const INFECTED_STATUSES = Enum.extend(STATUSES, ['zombie']);
  type InfectedStatus = InferValue<typeof INFECTED_STATUSES>;

  expect(INFECTED_STATUSES).type.toEqual<
    SimpleEnum<'alive' | 'dead' | 'zombie'>
  >();

  void function (status: InfectedStatus) {
    expect(status).type.toEqual<'alive' | 'dead' | 'zombie'>();
  };

  expect(INFECTED_STATUSES.values()).type.toEqual<
    ('alive' | 'dead' | 'zombie')[]
  >();

  void function (status: 'zombie' | 'werewolf') {
    if (INFECTED_STATUSES.hasValue(status)) {
      expect(status).type.toEqual<'zombie'>();
    }
  };

  void function (status: InferValue<typeof STATUSES>) {
    expect<InfectedStatus>().type.toBeAssignable(status);
  };

  expect(Enum.extend(STATUSES, [])).type.toEqual(STATUSES);
});

test('labeled enum', () => {
  const LOCALES = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
  const EXTENDED_LOCALES = Enum.extend(LOCALES, { German: 'de' });
  type ExtendedLocale = InferValue<typeof EXTENDED_LOCALES>;

  expect(EXTENDED_LOCALES).type.toEqual<
    LabeledEnum<{
      readonly English: 'en';
      readonly Czech: 'cs';
      readonly Slovak: 'sk';
      readonly German: 'de';
    }>
  >();

  void function (locale: ExtendedLocale) {
    expect(locale).type.toEqual<'en' | 'cs' | 'sk' | 'de'>();
  };

  void function (label: InferKey<typeof EXTENDED_LOCALES>) {
    expect(label).type.toEqual<'English' | 'Czech' | 'Slovak' | 'German'>();
  };

  void function (locale: InferValue<typeof LOCALES>) {
    expect<ExtendedLocale>().type.toBeAssignable(locale);
  };

  expect(Enum.extend(LOCALES, {})).type.toEqual(LOCALES);
});

test('labeled enum to simple enum', () => {
  const LOCALES = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
  const EXTENDED_LOCALES = Enum.extend(LOCALES, ['de']);
  type ExtendedLocale = InferValue<typeof EXTENDED_LOCALES>;

  expect(EXTENDED_LOCALES).type.toEqual<
    SimpleEnum<'en' | 'cs' | 'sk' | 'de'>
  >();

  void function (locale: ExtendedLocale) {
    expect(locale).type.toEqual<'en' | 'cs' | 'sk' | 'de'>();
  };

  expect<LabeledEnum<any>>().type.not.toBeAssignable(EXTENDED_LOCALES);

  expect(Enum.extend(LOCALES, [])).type.toEqual<
    SimpleEnum<InferValue<typeof LOCALES>>
  >();
  expect(LOCALES).type.not.toBeAssignable(Enum.extend(LOCALES, []));
});
