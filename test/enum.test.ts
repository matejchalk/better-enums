import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { $enum, InferValue } from '../src';

describe('$enum', () => {
  test('TSD static type checks', async () => {
    await expectTypeTestsToPassAsync(__filename);
  });

  describe('basic enum', () => {
    const ROLE = $enum(['viewer', 'editor', 'owner']);
    type Role = InferValue<typeof ROLE>;

    test('values', () => {
      expect(ROLE.values()).toEqual<Role[]>(['viewer', 'editor', 'owner']);
    });

    test('isValue', () => {
      expect(ROLE.isValue('editor')).toBe(true);
      expect(ROLE.isValue('admin')).toBe(false);
      expect(ROLE.isValue(null)).toBe(false);
    });

    test('assertValue', () => {
      expect(() => ROLE.assertValue('owner')).not.toThrow();
      expect(() => ROLE.assertValue(0)).toThrowError(
        'Enum value out of range (received 0, expected one of: "viewer", "editor", "owner")'
      );
    });
  });

  describe('labeled enum', () => {
    const LANGUAGE = $enum({
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

    test('isValue', () => {
      expect(LANGUAGE.isValue('Español')).toBe(true);
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

    test('isKey', () => {
      expect(LANGUAGE.isKey('cs')).toBe(true);
      expect(LANGUAGE.isKey('Español')).toBe(false);
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

    test('isEntry', () => {
      expect(LANGUAGE.isEntry(['cs', 'Español'])).toBe(false);
      expect(LANGUAGE.isEntry(['es', 'Español'])).toBe(true);
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
    const ACTION = $enum(Action);

    test('values', () => {
      expect(ACTION.values()).toEqual<InferValue<typeof ACTION>[]>([
        'allow',
        'block',
      ]);
    });

    test('isValue', () => {
      expect(ACTION.isValue(Action.Block)).toBe(true);
      expect(ACTION.isValue('block')).toBe(true);
      expect(ACTION.isValue('Block')).toBe(false);
    });

    test('keys', () => {
      expect(ACTION.keys()).toEqual<(keyof typeof Action)[]>([
        'Allow',
        'Block',
      ]);
    });

    test('isKey', () => {
      expect(ACTION.isKey('Allow')).toBe(true);
      expect(ACTION.isKey('allow')).toBe(false);
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
    const LEVEL = $enum(Level);

    test('values', () => {
      expect(LEVEL.values()).toEqual<Level[]>([0, 1, 2]);
    });

    test('isValue', () => {
      expect(LEVEL.isValue(Level.warn)).toBe(true);
      expect(LEVEL.isValue('warn')).toBe(false);
      expect(LEVEL.isValue(1)).toBe(true);
      expect(LEVEL.isValue(3)).toBe(false);
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
