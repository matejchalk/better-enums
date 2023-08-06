import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { Enum, InferKey, InferValue } from '../src';

describe('Enum.extend', () => {
  test('TSD static type checks', async () => {
    await expectTypeTestsToPassAsync(__filename);
  });

  describe('simple enum', () => {
    const STATUSES = Enum(['alive', 'dead']);
    const INFECTED_STATUSES = Enum.extend(STATUSES, ['zombie']);
    type InfectedStatus = InferValue<typeof INFECTED_STATUSES>;

    test('accessor', () => {
      expect(INFECTED_STATUSES.accessor).toEqual<
        (typeof INFECTED_STATUSES)['accessor']
      >({
        alive: 'alive',
        dead: 'dead',
        zombie: 'zombie',
      });
    });

    test('values', () => {
      expect(INFECTED_STATUSES.values()).toEqual<InfectedStatus[]>([
        'alive',
        'dead',
        'zombie',
      ]);
    });

    test('hasValue', () => {
      expect(INFECTED_STATUSES.hasValue('alive')).toBe(true);
      expect(INFECTED_STATUSES.hasValue('zombie')).toBe(true);
      expect(INFECTED_STATUSES.hasValue('werewolf')).toBe(false);
    });

    test('assertValue', () => {
      expect(() => INFECTED_STATUSES.assertValue('zombie')).not.toThrowError();
      expect(() => INFECTED_STATUSES.assertValue(null)).toThrowError(
        'Enum value out of range (received null, expected one of: "alive", "dead", "zombie")'
      );
    });
  });

  describe('labeled enum', () => {
    const LOCALES = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
    const EXTENDED_LOCALES = Enum.extend(LOCALES, { German: 'de' });
    type ExtendedLocale = InferValue<typeof EXTENDED_LOCALES>;

    test('accessor', () => {
      expect(EXTENDED_LOCALES.accessor).toEqual<
        (typeof EXTENDED_LOCALES)['accessor']
      >({
        English: 'en',
        Czech: 'cs',
        Slovak: 'sk',
        German: 'de',
      });
    });

    test('values', () => {
      expect(EXTENDED_LOCALES.values()).toEqual<ExtendedLocale[]>([
        'en',
        'cs',
        'sk',
        'de',
      ]);
    });

    test('hasValue', () => {
      expect(EXTENDED_LOCALES.hasValue('de')).toBe(true);
      expect(EXTENDED_LOCALES.hasValue(undefined)).toBe(false);
    });

    test('assertValue', () => {
      expect(() => EXTENDED_LOCALES.assertValue('de')).not.toThrowError();
      expect(() => EXTENDED_LOCALES.assertValue('German')).toThrowError(
        'Enum value out of range (received "German", expected one of: "en", "cs", "sk", "de")'
      );
    });

    test('keys', () => {
      expect(EXTENDED_LOCALES.keys()).toEqual<
        InferKey<typeof EXTENDED_LOCALES>[]
      >(['English', 'Czech', 'Slovak', 'German']);
    });

    test('hasKey', () => {
      expect(EXTENDED_LOCALES.hasKey('German')).toBe(true);
      expect(EXTENDED_LOCALES.hasKey('de')).toBe(false);
    });

    test('assertKey', () => {
      expect(() => EXTENDED_LOCALES.assertKey('German')).not.toThrowError();
      expect(() => EXTENDED_LOCALES.assertKey('Deutsch')).toThrowError(
        'Enum key out of range (received "Deutsch", expected one of: "English", "Czech", "Slovak", "German")'
      );
    });

    test('entries', () => {
      expect(EXTENDED_LOCALES.entries()).toEqual<
        [InferKey<typeof EXTENDED_LOCALES>, ExtendedLocale][]
      >([
        ['English', 'en'],
        ['Czech', 'cs'],
        ['Slovak', 'sk'],
        ['German', 'de'],
      ]);
    });

    test('hasEntry', () => {
      expect(EXTENDED_LOCALES.hasEntry(['German', 'de'])).toBe(true);
      expect(EXTENDED_LOCALES.hasEntry('de')).toBe(false);
    });

    test('assertEntry', () => {
      expect(() =>
        EXTENDED_LOCALES.assertEntry(['Czech', 'cs'])
      ).not.toThrowError();
      expect(() => EXTENDED_LOCALES.assertEntry(['German', 'en'])).toThrowError(
        'Enum key and value don\'t match (expected ["German", "de"] or ["English", "en"])'
      );
    });

    test('keyOf', () => {
      expect(EXTENDED_LOCALES.keyOf('de')).toBe('German');
      expect(EXTENDED_LOCALES.keyOf('sk')).toBe('Slovak');
    });
  });

  describe('labeled enum to simple enum', () => {
    const LOCALES = Enum({ English: 'en', Czech: 'cs', Slovak: 'sk' });
    const EXTENDED_LOCALES = Enum.extend(LOCALES, ['de']);
    type ExtendedLocale = InferValue<typeof EXTENDED_LOCALES>;

    test('no additional properties', () => {
      expect(EXTENDED_LOCALES).toEqual<typeof EXTENDED_LOCALES>({
        accessor: expect.any(Object),
        values: expect.any(Function),
        hasValue: expect.any(Function),
        assertValue: expect.any(Function),
      });
    });

    test('values', () => {
      expect(EXTENDED_LOCALES.values()).toEqual<ExtendedLocale[]>([
        'en',
        'cs',
        'sk',
        'de',
      ]);
    });

    test('hasValue', () => {
      expect(EXTENDED_LOCALES.hasValue('de')).toBe(true);
    });

    test('assertValue', () => {
      expect(() => EXTENDED_LOCALES.assertValue('de')).not.toThrowError();
    });
  });
});
