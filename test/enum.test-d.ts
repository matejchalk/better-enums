import { expectAssignable, expectNotAssignable, expectType } from 'jest-tsd';
import { Enum, InferKey, InferValue, SimpleEnum } from '../src';

test('simple enum', () => {
  const ROLE = Enum(['viewer', 'editor', 'owner']);
  type Role = InferValue<typeof ROLE>;

  void function (role: Role) {
    expectType<'viewer' | 'editor' | 'owner'>(role);
  };

  expectType<('viewer' | 'editor' | 'owner')[]>(ROLE.values());

  void function (possibleRole: string) {
    expectNotAssignable<Role>(possibleRole);
    if (ROLE.hasValue(possibleRole)) {
      expectType<Role>(possibleRole);
    }

    // assert function requires every identifier in the call chain to have an explicit type annotation
    const ROLE_EXPLICIT: SimpleEnum<Role> = ROLE;
    ROLE_EXPLICIT.assertValue(possibleRole);
    expectType<Role>(possibleRole);
  };
});

test('labeled enum', () => {
  const LANGUAGE = Enum({
    en: 'English',
    cs: 'Čeština',
    es: 'Español',
  });
  type Language = InferValue<typeof LANGUAGE>;
  const Language = LANGUAGE.accessor;

  void function (language: Language) {
    expectType<'English' | 'Čeština' | 'Español'>(language);
  };

  void function (label: InferKey<typeof LANGUAGE>) {
    expectType<'en' | 'cs' | 'es'>(label);
  };

  expectType<('English' | 'Čeština' | 'Español')[]>(LANGUAGE.values());

  expectType<
    Readonly<{
      en: 'English';
      cs: 'Čeština';
      es: 'Español';
    }>
  >(Language);

  expectType<'Čeština'>(Language.cs);

  LANGUAGE.entries().forEach(([key, value]) => {
    expectType<'en' | 'cs' | 'es'>(key);
    expectType<'English' | 'Čeština' | 'Español'>(value);
  });

  expectType<'es'>(LANGUAGE.keyOf('Español'));
});

test('from TypeScript string enum', () => {
  enum ActionEnum {
    Allow = 'allow',
    Block = 'block',
  }

  const ACTION = Enum(ActionEnum);
  type Action = InferValue<typeof ACTION>;

  void function (action: Action) {
    expectType<'allow' | 'block'>(action);
  };

  expectAssignable<readonly ActionEnum[]>(ACTION.values());

  void function (action: 'allow') {
    expectAssignable<Action>(action);
  };

  void function (invalidAction: 'allowed') {
    expectNotAssignable<Action>(invalidAction);
  };
});

test('from TypeScript number enum', () => {
  enum LevelEnum {
    off,
    warn,
    error,
  }

  const LEVEL = Enum(LevelEnum);
  type Level = InferValue<typeof LEVEL>;

  void function (level: 1) {
    expectAssignable<Level>(level);
  };

  void function (invalidLevel: 3) {
    expectNotAssignable<Level>(invalidLevel);
  };
});
