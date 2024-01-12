import { expect, test } from 'tstyche';
import { Enum, InferKey, InferValue, SimpleEnum } from '../src';

test('simple enum', () => {
  const ROLES = Enum(['viewer', 'editor', 'owner']);
  type Role = InferValue<typeof ROLES>;
  const Role = ROLES.accessor;

  void function (role: Role) {
    expect(role).type.toEqual<'viewer' | 'editor' | 'owner'>();
  };

  expect(ROLES.values()).type.toEqual<('viewer' | 'editor' | 'owner')[]>();

  void function (possibleRole: string) {
    expect<Role>().type.not.toBeAssignable(possibleRole);
    if (ROLES.hasValue(possibleRole)) {
      expect(possibleRole).type.toEqual<Role>();
    }

    // assert function requires every identifier in the call chain to have an explicit type annotation
    const ROLES_EXPLICIT: SimpleEnum<Role> = ROLES;
    ROLES_EXPLICIT.assertValue(possibleRole);
    expect(possibleRole).type.toEqual<Role>();
  };

  expect(Role).type.toEqual<{
    readonly viewer: 'viewer';
    readonly editor: 'editor';
    readonly owner: 'owner';
  }>();

  const PAGE_SIZES = Enum([10, 20, 50]);
  type PageSize = InferValue<typeof PAGE_SIZES>;

  void function (pageSize: PageSize) {
    expect(pageSize).type.toEqual<10 | 20 | 50>();
  };
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
    expect(language).type.toEqual<'English' | 'Čeština' | 'Español'>();
  };

  void function (label: InferKey<typeof LANGUAGES>) {
    expect(label).type.toEqual<'en' | 'cs' | 'es'>();
  };

  expect(LANGUAGES.values()).type.toEqual<
    ('English' | 'Čeština' | 'Español')[]
  >();

  expect(Language).type.toEqual<
    Readonly<{
      en: 'English';
      cs: 'Čeština';
      es: 'Español';
    }>
  >();

  expect(Language.cs).type.toEqual<'Čeština'>();

  LANGUAGES.entries().forEach(([key, value]) => {
    expect(key).type.toEqual<'en' | 'cs' | 'es'>();
    expect(value).type.toEqual<'English' | 'Čeština' | 'Español'>();
  });

  expect(LANGUAGES.keyOf('Español')).type.toEqual<'es'>();
});

test('from TypeScript string enum', () => {
  enum ActionEnum {
    Allow = 'allow',
    Block = 'block',
  }

  const ACTIONS = Enum(ActionEnum);
  type Action = InferValue<typeof ACTIONS>;

  void function (action: Action) {
    expect(action).type.toEqual<'allow' | 'block'>();
  };

  expect<readonly ActionEnum[]>().type.toBeAssignable(ACTIONS.values());

  void function (action: 'allow') {
    expect<Action>().type.toBeAssignable(action);
  };

  void function (invalidAction: 'allowed') {
    expect<Action>().type.not.toBeAssignable(invalidAction);
  };

  expect<'Block'>().type.toBeAssignable(ACTIONS.keyOf('block'));
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
    expect<Level>().type.toBeAssignable(level);
  };

  void function (invalidLevel: 3) {
    expect<Level>().type.not.toBeAssignable(invalidLevel);
  };

  expect(LEVELS.keyOf(1)).type.toEqual<'warn'>();
});
