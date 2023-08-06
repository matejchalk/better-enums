import { expectAssignable, expectNotAssignable, expectType } from 'jest-tsd';
import { Enum, InferKey, InferValue, LabeledEnum, SimpleEnum } from '../src';

test('simple enum', () => {
  const STATUSES = Enum(['pending', 'fulfilled', 'rejected']);
  type Status = InferValue<typeof STATUSES>;
  const SETTLED_STATUSES = Enum.exclude(STATUSES, ['pending']);
  type SettledStatus = InferValue<typeof SETTLED_STATUSES>;

  expectType<SimpleEnum<'fulfilled' | 'rejected'>>(SETTLED_STATUSES);

  void function (status: SettledStatus) {
    expectType<'fulfilled' | 'rejected'>(status);
  };

  expectType<('fulfilled' | 'rejected')[]>(SETTLED_STATUSES.values());

  void function (status: Status) {
    expectNotAssignable<SettledStatus>(status);
    if (SETTLED_STATUSES.hasValue(status)) {
      expectAssignable<SettledStatus>(status);
    }
  };

  void function (status: SettledStatus) {
    expectAssignable<SettledStatus>(status);
  };

  expectType<typeof STATUSES>(Enum.exclude(STATUSES, []));

  expectType<SimpleEnum<never>>(Enum.exclude(STATUSES, STATUSES.values()));
});

test('labeled enum - remove by key', () => {
  const LEVELS = Enum({ off: 0, warn: 1, error: 2 });
  const ERROR_LEVELS = Enum.exclude(LEVELS, ['off']);
  type ErrorLevel = InferValue<typeof ERROR_LEVELS>;

  expectType<
    LabeledEnum<{
      readonly warn: 1;
      readonly error: 2;
    }>
  >(ERROR_LEVELS);

  void function (level: ErrorLevel) {
    expectType<1 | 2>(level);
  };

  void function (label: InferKey<typeof ERROR_LEVELS>) {
    expectType<'warn' | 'error'>(label);
  };

  void function (level: ErrorLevel) {
    expectAssignable<InferValue<typeof LEVELS>>(level);
  };

  expectType<typeof LEVELS>(Enum.exclude(LEVELS, []));

  expectType<LabeledEnum<{ readonly off: 0 }>>(
    Enum.exclude(LEVELS, ['warn', 'error'])
  );

  expectType<LabeledEnum<{}>>(Enum.exclude(LEVELS, LEVELS.keys()));
});

test('labeled enum - remove by value', () => {
  const LEVELS = Enum({ off: 0, warn: 1, error: 2 });
  const ERROR_LEVELS = Enum.exclude(LEVELS, [0]);
  type ErrorLevel = InferValue<typeof ERROR_LEVELS>;

  expectType<
    LabeledEnum<{
      readonly warn: 1;
      readonly error: 2;
    }>
  >(ERROR_LEVELS);

  void function (level: ErrorLevel) {
    expectType<1 | 2>(level);
  };

  void function (label: InferKey<typeof ERROR_LEVELS>) {
    expectType<'warn' | 'error'>(label);
  };

  void function (level: ErrorLevel) {
    expectAssignable<InferValue<typeof LEVELS>>(level);
  };

  expectType<typeof LEVELS>(Enum.exclude(LEVELS, []));

  expectType<LabeledEnum<{ readonly off: 0 }>>(Enum.exclude(LEVELS, [1, 2]));

  expectType<LabeledEnum<{}>>(Enum.exclude(LEVELS, LEVELS.values()));
});
