import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { Enum, InferValue } from '../src';

describe('Enum', () => {
  test('TSD static type checks', async () => {
    await expectTypeTestsToPassAsync(__filename);
  });

  describe('simple enum', () => {
    const ROLES = Enum(['viewer', 'editor', 'owner']);
    type Role = InferValue<typeof ROLES>;

    test('accessor', () => {
      expect(ROLES.accessor).toEqual({
        viewer: 'viewer',
        editor: 'editor',
        owner: 'owner',
      });
    });

    test('values', () => {
      expect(ROLES.values()).toEqual<Role[]>(['viewer', 'editor', 'owner']);
    });

    test('hasValue', () => {
      expect(ROLES.hasValue('editor')).toBe(true);
      expect(ROLES.hasValue('admin')).toBe(false);
      expect(ROLES.hasValue(null)).toBe(false);
    });

    test('assertValue', () => {
      expect(() => ROLES.assertValue('owner')).not.toThrow();
      expect(() => ROLES.assertValue(0)).toThrowError(
        'Enum value out of range (received 0, expected one of: "viewer", "editor", "owner")'
      );
    });
  });

  describe('labeled enum', () => {
    const LANGUAGES = Enum({
      en: 'English',
      cs: 'Čeština',
      es: 'Español',
    });
    type Language = InferValue<typeof LANGUAGES>;

    test('accessor', () => {
      expect(LANGUAGES.accessor).toEqual({
        en: 'English',
        cs: 'Čeština',
        es: 'Español',
      });
    });

    test('values', () => {
      expect(LANGUAGES.values()).toEqual<Language[]>([
        'English',
        'Čeština',
        'Español',
      ]);
    });

    test('hasValue', () => {
      expect(LANGUAGES.hasValue('Español')).toBe(true);
    });

    test('assertValue', () => {
      expect(() => LANGUAGES.assertValue('Español')).not.toThrowError();
    });

    test('keys', () => {
      expect(LANGUAGES.keys()).toEqual<ReturnType<(typeof LANGUAGES)['keys']>>([
        'en',
        'cs',
        'es',
      ]);
    });

    test('hasKey', () => {
      expect(LANGUAGES.hasKey('cs')).toBe(true);
      expect(LANGUAGES.hasKey('Español')).toBe(false);
    });

    test('assertKey', () => {
      expect(() => LANGUAGES.assertKey('es')).not.toThrowError();
      expect(() => LANGUAGES.assertKey(undefined)).toThrowError(
        `Enum key out of range (received undefined, expected one of: "en", "cs", "es")`
      );
    });

    test('entries', () => {
      expect(LANGUAGES.entries()).toEqual<
        ReturnType<(typeof LANGUAGES)['entries']>
      >([
        ['en', 'English'],
        ['cs', 'Čeština'],
        ['es', 'Español'],
      ]);
    });

    test('hasEntry', () => {
      expect(LANGUAGES.hasEntry(['cs', 'Español'])).toBe(false);
      expect(LANGUAGES.hasEntry(['es', 'Español'])).toBe(true);
    });

    test('assertEntry', () => {
      expect(() => LANGUAGES.assertEntry(['en', 'English'])).not.toThrowError();
      expect(() => LANGUAGES.assertEntry(['de', 'Español'])).toThrowError(
        'Enum key out of range (received "de", expected one of: "en", "cs", "es")'
      );
      expect(() => LANGUAGES.assertEntry(['cs', 'Español'])).toThrowError(
        'Enum key and value don\'t match (expected ["cs", "Čeština"] or ["es", "Español"])'
      );
      expect(() => LANGUAGES.assertEntry(['es'])).toThrowError(
        'Enum entry must be a tuple (e.g. ["key", "value"])'
      );
    });

    test('keyOf', () => {
      expect(LANGUAGES.keyOf('English')).toBe('en');
      expect(LANGUAGES.keyOf('Español')).toBe('es');
    });
  });

  describe('from TypeScript string enum', () => {
    enum Action {
      Allow = 'allow',
      Block = 'block',
    }
    const ACTIONS = Enum(Action);

    test('accessor', () => {
      expect(ACTIONS.accessor).toEqual({
        Allow: 'allow',
        Block: 'block',
      });
    });

    test('values', () => {
      expect(ACTIONS.values()).toEqual<InferValue<typeof ACTIONS>[]>([
        'allow',
        'block',
      ]);
    });

    test('hasValue', () => {
      expect(ACTIONS.hasValue(Action.Block)).toBe(true);
      expect(ACTIONS.hasValue('block')).toBe(true);
      expect(ACTIONS.hasValue('Block')).toBe(false);
    });

    test('keys', () => {
      expect(ACTIONS.keys()).toEqual<(keyof typeof Action)[]>([
        'Allow',
        'Block',
      ]);
    });

    test('hasKey', () => {
      expect(ACTIONS.hasKey('Allow')).toBe(true);
      expect(ACTIONS.hasKey('allow')).toBe(false);
    });

    test('entries', () => {
      expect(ACTIONS.entries()).toEqual<[keyof typeof Action, `${Action}`][]>([
        ['Allow', 'allow'],
        ['Block', 'block'],
      ]);
    });

    test('keyOf', () => {
      expect(ACTIONS.keyOf(Action.Allow)).toEqual('Allow');
      expect(ACTIONS.keyOf('block')).toEqual('Block');
    });
  });

  describe('from TypeScript number enum', () => {
    enum Level {
      off,
      warn,
      error,
    }
    const LEVELS = Enum(Level);

    test('values', () => {
      expect(LEVELS.values()).toEqual<Level[]>([0, 1, 2]);
    });

    test('hasValue', () => {
      expect(LEVELS.hasValue(Level.warn)).toBe(true);
      expect(LEVELS.hasValue('warn')).toBe(false);
      expect(LEVELS.hasValue(1)).toBe(true);
      expect(LEVELS.hasValue(3)).toBe(false);
    });

    test('keys', () => {
      expect(LEVELS.keys()).toEqual<(keyof typeof Level)[]>([
        'off',
        'warn',
        'error',
      ]);
    });

    test('keyOf', () => {
      expect(LEVELS.keyOf(2)).toEqual('error');
      expect(LEVELS.keyOf(Level.warn)).toEqual('warn');
    });
  });
});
