import { expectAssignable, expectNotAssignable, expectType } from 'jest-tsd';
import { $enum, BasicEnum, KeyOf, ValueOf } from '../src';

test('basic enum', () => {
  const ROLE = $enum(['viewer', 'editor', 'owner']);
  type Role = ValueOf<typeof ROLE>;

  void function (role: Role) {
    expectType<'viewer' | 'editor' | 'owner'>(role);
  };

  expectType<readonly ('viewer' | 'editor' | 'owner')[]>(ROLE.values());

  void function (possibleRole: string) {
    expectNotAssignable<Role>(possibleRole);
    if (ROLE.isValue(possibleRole)) {
      expectType<Role>(possibleRole);
    }

    // assert function requires every identifier in the call chain to have an explicit type annotation
    const ROLE_EXPLICIT: BasicEnum<Role> = ROLE;
    ROLE_EXPLICIT.assertValue(possibleRole);
    expectType<Role>(possibleRole);
  };
});

test('advanced enum', () => {
  const LANGUAGE = $enum({
    en: 'English',
    cs: 'Čeština',
    es: 'Español',
  });
  type Language = ValueOf<typeof LANGUAGE>;
  const Language = LANGUAGE.obj;

  void function (language: Language) {
    expectType<'English' | 'Čeština' | 'Español'>(language);
  };

  void function (label: KeyOf<typeof LANGUAGE>) {
    expectType<'en' | 'cs' | 'es'>(label);
  };

  expectType<readonly ('English' | 'Čeština' | 'Español')[]>(LANGUAGE.values());

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

  const ACTION = $enum(ActionEnum);
  type Action = ValueOf<typeof ACTION>;

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

  const LEVEL = $enum(LevelEnum);
  type Level = ValueOf<typeof LEVEL>;

  void function (level: 1) {
    expectAssignable<Level>(level);
  };

  void function (invalidLevel: 3) {
    expectNotAssignable<Level>(invalidLevel);
  };
});
