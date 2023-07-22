import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { Enum, InferValue } from '../src';

describe('Enum', () => {
  test('TSD static type checks', async () => {
    await expectTypeTestsToPassAsync(__filename);
  });

  describe('basic enum', () => {
    const ROLE = Enum(['viewer', 'editor', 'owner']);
    type Role = InferValue<typeof ROLE>;

    test('values', () => {
      expect(ROLE.values()).toEqual<Role[]>(['viewer', 'editor', 'owner']);
    });

    test('hasValue', () => {
      expect(ROLE.hasValue('editor')).toBe(true);
      expect(ROLE.hasValue('admin')).toBe(false);
      expect(ROLE.hasValue(null)).toBe(false);
    });

    test('assertValue', () => {
      expect(() => ROLE.assertValue('owner')).not.toThrow();
      expect(() => ROLE.assertValue(0)).toThrowError(
        'Enum value out of range (received 0, expected one of: "viewer", "editor", "owner")'
      );
    });
  });

  describe('labeled enum', () => {
    const LANGUAGE = Enum({
      en: 'English',
      cs: 'Čeština',
      es: 'Español',
    });
    type Language = InferValue<typeof LANGUAGE>;

    test('values', () => {
      expect(LANGUAGE.values()).toEqual<Language[]>([
        'English',
        'Čeština',
        'Español',
      ]);
    });

    test('hasValue', () => {
      expect(LANGUAGE.hasValue('Español')).toBe(true);
    });

    test('assertValue', () => {
      expect(() => LANGUAGE.assertValue('Español')).not.toThrowError();
    });

    test('keys', () => {
      expect(LANGUAGE.keys()).toEqual<ReturnType<(typeof LANGUAGE)['keys']>>([
        'en',
        'cs',
        'es',
      ]);
    });

    test('hasKey', () => {
      expect(LANGUAGE.hasKey('cs')).toBe(true);
      expect(LANGUAGE.hasKey('Español')).toBe(false);
    });

    test('assertKey', () => {
      expect(() => LANGUAGE.assertKey('es')).not.toThrowError();
      expect(() => LANGUAGE.assertKey(undefined)).toThrowError(
        `Enum key out of range (received undefined, expected one of: "en", "cs", "es")`
      );
    });

    test('entries', () => {
      expect(LANGUAGE.entries()).toEqual<
        ReturnType<(typeof LANGUAGE)['entries']>
      >([
        ['en', 'English'],
        ['cs', 'Čeština'],
        ['es', 'Español'],
      ]);
    });

    test('hasEntry', () => {
      expect(LANGUAGE.hasEntry(['cs', 'Español'])).toBe(false);
      expect(LANGUAGE.hasEntry(['es', 'Español'])).toBe(true);
    });

    test('assertEntry', () => {
      expect(() => LANGUAGE.assertEntry(['en', 'English'])).not.toThrowError();
      expect(() => LANGUAGE.assertEntry(['de', 'Español'])).toThrowError(
        'Enum key out of range (received "de", expected one of: "en", "cs", "es")'
      );
      expect(() => LANGUAGE.assertEntry(['cs', 'Español'])).toThrowError(
        'Enum key and value don\'t match (expected ["cs", "Čeština"] or ["es", "Español"])'
      );
      expect(() => LANGUAGE.assertEntry(['es'])).toThrowError(
        'Enum entry must be a tuple (e.g. ["key", "value"])'
      );
    });

    test('obj', () => {
      expect(LANGUAGE.object).toEqual({
        en: 'English',
        cs: 'Čeština',
        es: 'Español',
      });
    });

    test('keyOf', () => {
      expect(LANGUAGE.keyOf('English')).toBe('en');
      expect(LANGUAGE.keyOf('Español')).toBe('es');
    });
  });

  describe('from TypeScript string enum', () => {
    enum Action {
      Allow = 'allow',
      Block = 'block',
    }
    const ACTION = Enum(Action);

    test('values', () => {
      expect(ACTION.values()).toEqual<InferValue<typeof ACTION>[]>([
        'allow',
        'block',
      ]);
    });

    test('hasValue', () => {
      expect(ACTION.hasValue(Action.Block)).toBe(true);
      expect(ACTION.hasValue('block')).toBe(true);
      expect(ACTION.hasValue('Block')).toBe(false);
    });

    test('keys', () => {
      expect(ACTION.keys()).toEqual<(keyof typeof Action)[]>([
        'Allow',
        'Block',
      ]);
    });

    test('hasKey', () => {
      expect(ACTION.hasKey('Allow')).toBe(true);
      expect(ACTION.hasKey('allow')).toBe(false);
    });

    test('entries', () => {
      expect(ACTION.entries()).toEqual<[keyof typeof Action, `${Action}`][]>([
        ['Allow', 'allow'],
        ['Block', 'block'],
      ]);
    });

    test('object', () => {
      expect(ACTION.object).toEqual({
        Allow: 'allow',
        Block: 'block',
      });
    });

    test('keyOf', () => {
      expect(ACTION.keyOf(Action.Allow)).toEqual('Allow');
      expect(ACTION.keyOf('block')).toEqual('Block');
    });
  });

  describe('from TypeScript number enum', () => {
    enum Level {
      off,
      warn,
      error,
    }
    const LEVEL = Enum(Level);

    test('values', () => {
      expect(LEVEL.values()).toEqual<Level[]>([0, 1, 2]);
    });

    test('hasValue', () => {
      expect(LEVEL.hasValue(Level.warn)).toBe(true);
      expect(LEVEL.hasValue('warn')).toBe(false);
      expect(LEVEL.hasValue(1)).toBe(true);
      expect(LEVEL.hasValue(3)).toBe(false);
    });

    test('keys', () => {
      expect(LEVEL.keys()).toEqual<(keyof typeof Level)[]>([
        'off',
        'warn',
        'error',
      ]);
    });

    test('keyOf', () => {
      expect(LEVEL.keyOf(2)).toEqual('error');
      expect(LEVEL.keyOf(Level.warn)).toEqual('warn');
    });
  });
});
