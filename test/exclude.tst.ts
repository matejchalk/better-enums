import { expect, test } from 'tstyche';
import { Enum, InferKey, InferValue, LabeledEnum, SimpleEnum } from '../src';

test('simple enum', () => {
  const STATUSES = Enum(['pending', 'fulfilled', 'rejected']);
  type Status = InferValue<typeof STATUSES>;
  const SETTLED_STATUSES = Enum.exclude(STATUSES, ['pending']);
  type SettledStatus = InferValue<typeof SETTLED_STATUSES>;

  expect(SETTLED_STATUSES).type.toEqual<SimpleEnum<'fulfilled' | 'rejected'>>();

  void function (status: SettledStatus) {
    expect(status).type.toEqual<'fulfilled' | 'rejected'>();
  };

  expect(SETTLED_STATUSES.values()).type.toEqual<
    ('fulfilled' | 'rejected')[]
  >();

  void function (status: Status) {
    expect<SettledStatus>().type.not.toBeAssignable(status);
    if (SETTLED_STATUSES.hasValue(status)) {
      expect<SettledStatus>().type.toBeAssignable(status);
    }
  };

  void function (status: SettledStatus) {
    expect<SettledStatus>().type.toBeAssignable(status);
  };

  expect(Enum.exclude(STATUSES, [])).type.toEqual(STATUSES);

  expect(Enum.exclude(STATUSES, STATUSES.values())).type.toEqual<
    SimpleEnum<never>
  >();
});

test('labeled enum - remove by key', () => {
  const LEVELS = Enum({ off: 0, warn: 1, error: 2 });
  const ERROR_LEVELS = Enum.exclude(LEVELS, ['off']);
  type ErrorLevel = InferValue<typeof ERROR_LEVELS>;

  expect(ERROR_LEVELS).type.toEqual<
    LabeledEnum<{
      readonly warn: 1;
      readonly error: 2;
    }>
  >();

  void function (level: ErrorLevel) {
    expect(level).type.toEqual<1 | 2>();
  };

  void function (label: InferKey<typeof ERROR_LEVELS>) {
    expect(label).type.toEqual<'warn' | 'error'>();
  };

  void function (level: ErrorLevel) {
    expect<InferValue<typeof LEVELS>>().type.toBeAssignable(level);
  };

  expect(Enum.exclude(LEVELS, [])).type.toEqual(LEVELS);

  expect(Enum.exclude(LEVELS, ['warn', 'error'])).type.toEqual<
    LabeledEnum<{ readonly off: 0 }>
  >();

  expect(Enum.exclude(LEVELS, LEVELS.keys())).type.toEqual<LabeledEnum<{}>>();
});

test('labeled enum - remove by value', () => {
  const LEVELS = Enum({ off: 0, warn: 1, error: 2 });
  const ERROR_LEVELS = Enum.exclude(LEVELS, [0]);
  type ErrorLevel = InferValue<typeof ERROR_LEVELS>;

  expect(ERROR_LEVELS).type.toEqual<
    LabeledEnum<{
      readonly warn: 1;
      readonly error: 2;
    }>
  >();

  void function (level: ErrorLevel) {
    expect(level).type.toEqual<1 | 2>();
  };

  void function (label: InferKey<typeof ERROR_LEVELS>) {
    expect(label).type.toEqual<'warn' | 'error'>();
  };

  void function (level: ErrorLevel) {
    expect<InferValue<typeof LEVELS>>().type.toBeAssignable(level);
  };

  expect(Enum.exclude(LEVELS, [])).type.toEqual(LEVELS);

  expect(Enum.exclude(LEVELS, [1, 2])).type.toEqual<
    LabeledEnum<{ readonly off: 0 }>
  >();

  expect(Enum.exclude(LEVELS, LEVELS.values())).type.toEqual<LabeledEnum<{}>>();
});
