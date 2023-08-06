import { expectAssignable, expectNotAssignable, expectType } from 'jest-tsd';
import { Enum, InferKey, InferValue, SimpleEnum } from '../src';

test('simple enum', () => {
  const ROLES = Enum(['viewer', 'editor', 'owner']);
  type Role = InferValue<typeof ROLES>;
  const Role = ROLES.accessor;

  void function (role: Role) {
    expectType<'viewer' | 'editor' | 'owner'>(role);
  };

  expectType<('viewer' | 'editor' | 'owner')[]>(ROLES.values());

  void function (possibleRole: string) {
    expectNotAssignable<Role>(possibleRole);
    if (ROLES.hasValue(possibleRole)) {
      expectType<Role>(possibleRole);
    }

    // assert function requires every identifier in the call chain to have an explicit type annotation
    const ROLES_EXPLICIT: SimpleEnum<Role> = ROLES;
    ROLES_EXPLICIT.assertValue(possibleRole);
    expectType<Role>(possibleRole);
  };

  expectType<{
    readonly viewer: 'viewer';
    readonly editor: 'editor';
    readonly owner: 'owner';
  }>(Role);
});

test('labeled enum', () => {
  const LANGUAGES = Enum({
    en: 'English',
    cs: 'Čeština',
    es: 'Español',
  });
  type Language = InferValue<typeof LANGUAGES>;
  const Language = LANGUAGES.accessor;

  void function (language: Language) {
    expectType<'English' | 'Čeština' | 'Español'>(language);
  };

  void function (label: InferKey<typeof LANGUAGES>) {
    expectType<'en' | 'cs' | 'es'>(label);
  };

  expectType<('English' | 'Čeština' | 'Español')[]>(LANGUAGES.values());

  expectType<
    Readonly<{
      en: 'English';
      cs: 'Čeština';
      es: 'Español';
    }>
  >(Language);

  expectType<'Čeština'>(Language.cs);

  LANGUAGES.entries().forEach(([key, value]) => {
    expectType<'en' | 'cs' | 'es'>(key);
    expectType<'English' | 'Čeština' | 'Español'>(value);
  });

  expectType<'es'>(LANGUAGES.keyOf('Español'));
});

test('from TypeScript string enum', () => {
  enum ActionEnum {
    Allow = 'allow',
    Block = 'block',
  }

  const ACTIONS = Enum(ActionEnum);
  type Action = InferValue<typeof ACTIONS>;

  void function (action: Action) {
    expectType<'allow' | 'block'>(action);
  };

  expectAssignable<readonly ActionEnum[]>(ACTIONS.values());

  void function (action: 'allow') {
    expectAssignable<Action>(action);
  };

  void function (invalidAction: 'allowed') {
    expectNotAssignable<Action>(invalidAction);
  };

  expect<'Block'>(ACTIONS.keyOf('block'));
});

test('from TypeScript number enum', () => {
  enum LevelEnum {
    off,
    warn,
    error,
  }

  const LEVELS = Enum(LevelEnum);
  type Level = InferValue<typeof LEVELS>;

  void function (level: 1) {
    expectAssignable<Level>(level);
  };

  void function (invalidLevel: 3) {
    expectNotAssignable<Level>(invalidLevel);
  };

  expectType<'warn'>(LEVELS.keyOf(1));
});
