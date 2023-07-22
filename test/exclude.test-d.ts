import { expectAssignable, expectNotAssignable, expectType } from 'jest-tsd';
import { BasicEnum, Enum, InferKey, InferValue, LabeledEnum } from '../src';

test('basic enum', () => {
  const STATUS = Enum(['pending', 'fulfilled', 'rejected']);
  type Status = InferValue<typeof STATUS>;
  const SETTLED_STATUS = Enum.exclude(STATUS, ['pending']);
  type SettledStatus = InferValue<typeof SETTLED_STATUS>;

  expectType<BasicEnum<'fulfilled' | 'rejected'>>(SETTLED_STATUS);

  void function (status: SettledStatus) {
    expectType<'fulfilled' | 'rejected'>(status);
  };

  expectType<('fulfilled' | 'rejected')[]>(SETTLED_STATUS.values());

  void function (status: Status) {
    expectNotAssignable<SettledStatus>(status);
    if (SETTLED_STATUS.isValue(status)) {
      expectAssignable<SettledStatus>(status);
    }
  };

  void function (status: SettledStatus) {
    expectAssignable<SettledStatus>(status);
  };

  expectType<typeof STATUS>(Enum.exclude(STATUS, []));

  expectType<BasicEnum<never>>(Enum.exclude(STATUS, STATUS.values()));
});

test('labeled enum - remove by key', () => {
  const LEVEL = Enum({ off: 0, warn: 1, error: 2 });
  const ERROR_LEVEL = Enum.exclude(LEVEL, ['off']);
  type ErrorLevel = InferValue<typeof ERROR_LEVEL>;

  expectType<
    LabeledEnum<{
      readonly warn: 1;
      readonly error: 2;
    }>
  >(ERROR_LEVEL);

  void function (level: ErrorLevel) {
    expectType<1 | 2>(level);
  };

  void function (label: InferKey<typeof ERROR_LEVEL>) {
    expectType<'warn' | 'error'>(label);
  };

  void function (level: ErrorLevel) {
    expectAssignable<InferValue<typeof LEVEL>>(level);
  };

  expectType<typeof LEVEL>(Enum.exclude(LEVEL, []));

  expectType<LabeledEnum<{ readonly off: 0 }>>(
    Enum.exclude(LEVEL, ['warn', 'error'])
  );

  expectType<LabeledEnum<{}>>(Enum.exclude(LEVEL, LEVEL.keys()));
});

test('labeled enum - remove by value', () => {
  const LEVEL = Enum({ off: 0, warn: 1, error: 2 });
  const ERROR_LEVEL = Enum.exclude(LEVEL, [0]);
  type ErrorLevel = InferValue<typeof ERROR_LEVEL>;

  expectType<
    LabeledEnum<{
      readonly warn: 1;
      readonly error: 2;
    }>
  >(ERROR_LEVEL);

  void function (level: ErrorLevel) {
    expectType<1 | 2>(level);
  };

  void function (label: InferKey<typeof ERROR_LEVEL>) {
    expectType<'warn' | 'error'>(label);
  };

  void function (level: ErrorLevel) {
    expectAssignable<InferValue<typeof LEVEL>>(level);
  };

  expectType<typeof LEVEL>(Enum.exclude(LEVEL, []));

  expectType<LabeledEnum<{ readonly off: 0 }>>(Enum.exclude(LEVEL, [1, 2]));

  expectType<LabeledEnum<{}>>(Enum.exclude(LEVEL, LEVEL.values()));
});
