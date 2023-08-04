import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { Enum, InferKey, InferValue } from '../src';

describe('Enum.extend', () => {
  test('TSD static type checks', async () => {
    await expectTypeTestsToPassAsync(__filename);
  });

  describe('simple enum', () => {
    const STATUS = Enum(['alive', 'dead']);
    const INFECTED_STATUS = Enum.extend(STATUS, ['zombie']);
    type InfectedStatus = InferValue<typeof INFECTED_STATUS>;

    test('values', () => {
      expect(INFECTED_STATUS.values()).toEqual<InfectedStatus[]>([
        'alive',
        'dead',
        'zombie',
      ]);
    });

    test('hasValue', () => {
      expect(INFECTED_STATUS.hasValue('alive')).toBe(true);
      expect(INFECTED_STATUS.hasValue('zombie')).toBe(true);
      expect(INFECTED_STATUS.hasValue('werewolf')).toBe(false);
    });

    test('assertValue', () => {
      expect(() => INFECTED_STATUS.assertValue('zombie')).not.toThrowError();
      expect(() => INFECTED_STATUS.assertValue(null)).toThrowError(
        'Enum value out of range (received null, expected one of: "alive", "dead", "zombie")'
      );
    });
  });

  describe('labeled enum', () => {
    const LOCALE = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
    const EXTENDED_LOCALE = Enum.extend(LOCALE, { German: 'de' });
    type ExtendedLocale = InferValue<typeof EXTENDED_LOCALE>;

    test('values', () => {
      expect(EXTENDED_LOCALE.values()).toEqual<ExtendedLocale[]>([
        'en',
        'cs',
        'sk',
        'de',
      ]);
    });

    test('hasValue', () => {
      expect(EXTENDED_LOCALE.hasValue('de')).toBe(true);
      expect(EXTENDED_LOCALE.hasValue(undefined)).toBe(false);
    });

    test('assertValue', () => {
      expect(() => EXTENDED_LOCALE.assertValue('de')).not.toThrowError();
      expect(() => EXTENDED_LOCALE.assertValue('German')).toThrowError(
        'Enum value out of range (received "German", expected one of: "en", "cs", "sk", "de")'
      );
    });

    test('keys', () => {
      expect(EXTENDED_LOCALE.keys()).toEqual<
        InferKey<typeof EXTENDED_LOCALE>[]
      >(['English', 'Czech', 'Slovak', 'German']);
    });

    test('hasKey', () => {
      expect(EXTENDED_LOCALE.hasKey('German')).toBe(true);
      expect(EXTENDED_LOCALE.hasKey('de')).toBe(false);
    });

    test('assertKey', () => {
      expect(() => EXTENDED_LOCALE.assertKey('German')).not.toThrowError();
      expect(() => EXTENDED_LOCALE.assertKey('Deutsch')).toThrowError(
        'Enum key out of range (received "Deutsch", expected one of: "English", "Czech", "Slovak", "German")'
      );
    });

    test('entries', () => {
      expect(EXTENDED_LOCALE.entries()).toEqual<
        [InferKey<typeof EXTENDED_LOCALE>, ExtendedLocale][]
      >([
        ['English', 'en'],
        ['Czech', 'cs'],
        ['Slovak', 'sk'],
        ['German', 'de'],
      ]);
    });

    test('hasEntry', () => {
      expect(EXTENDED_LOCALE.hasEntry(['German', 'de'])).toBe(true);
      expect(EXTENDED_LOCALE.hasEntry('de')).toBe(false);
    });

    test('assertEntry', () => {
      expect(() =>
        EXTENDED_LOCALE.assertEntry(['Czech', 'cs'])
      ).not.toThrowError();
      expect(() => EXTENDED_LOCALE.assertEntry(['German', 'en'])).toThrowError(
        'Enum key and value don\'t match (expected ["German", "de"] or ["English", "en"])'
      );
    });

    test('accessor', () => {
      expect(EXTENDED_LOCALE.accessor).toEqual<
        (typeof EXTENDED_LOCALE)['accessor']
      >({
        English: 'en',
        Czech: 'cs',
        Slovak: 'sk',
        German: 'de',
      });
    });

    test('keyOf', () => {
      expect(EXTENDED_LOCALE.keyOf('de')).toBe('German');
      expect(EXTENDED_LOCALE.keyOf('sk')).toBe('Slovak');
    });
  });

  describe('labeled enum to simple enum', () => {
    const LOCALE = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
    const EXTENDED_LOCALE = Enum.extend(LOCALE, ['de']);
    type ExtendedLocale = InferValue<typeof EXTENDED_LOCALE>;

    test('no additional properties', () => {
      expect(EXTENDED_LOCALE).toEqual<typeof EXTENDED_LOCALE>({
        values: expect.any(Function),
        hasValue: expect.any(Function),
        assertValue: expect.any(Function),
      });
    });

    test('values', () => {
      expect(EXTENDED_LOCALE.values()).toEqual<ExtendedLocale[]>([
        'en',
        'cs',
        'sk',
        'de',
      ]);
    });

    test('hasValue', () => {
      expect(EXTENDED_LOCALE.hasValue('de')).toBe(true);
    });

    test('assertValue', () => {
      expect(() => EXTENDED_LOCALE.assertValue('de')).not.toThrowError();
    });
  });
});
