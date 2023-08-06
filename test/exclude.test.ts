import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { Enum, InferValue } from '../src';

describe('Enum.exclude', () => {
  test('TSD static type checks', async () => {
    await expectTypeTestsToPassAsync(__filename);
  });

  describe('simple enum', () => {
    const STATUSES = Enum(['pending', 'fulfilled', 'rejected']);
    const SETTLED_STATUSES = Enum.exclude(STATUSES, ['pending']);
    type SettledStatus = InferValue<typeof SETTLED_STATUSES>;

    test('accessor', () => {
      expect(SETTLED_STATUSES.accessor).toEqual<
        (typeof SETTLED_STATUSES)['accessor']
      >({
        fulfilled: 'fulfilled',
        rejected: 'rejected',
      });
    });

    test('values', () => {
      expect(SETTLED_STATUSES.values()).toEqual<SettledStatus[]>([
        'fulfilled',
        'rejected',
      ]);
    });

    test('hasValue', () => {
      expect(SETTLED_STATUSES.hasValue('pending')).toBe(false);
      expect(SETTLED_STATUSES.hasValue('rejected')).toBe(true);
    });

    test('assertValue', () => {
      expect(() => SETTLED_STATUSES.assertValue('pending')).toThrowError(
        'Enum value out of range (received "pending", expected one of: "fulfilled", "rejected")'
      );
      expect(() => SETTLED_STATUSES.assertValue('rejected')).not.toThrowError();
    });
  });

  describe('labeled enum - remove by key', () => {
    const LEVELS = Enum({ off: 0, warn: 1, error: 2 });
    const ERROR_LEVELS = Enum.exclude(LEVELS, ['off']);

    test('accessor', () => {
      expect(ERROR_LEVELS.accessor).toEqual<(typeof ERROR_LEVELS)['accessor']>({
        warn: 1,
        error: 2,
      });
    });

    test('values', () => {
      expect(ERROR_LEVELS.values()).toEqual([1, 2]);
    });

    test('hasValue', () => {
      expect(ERROR_LEVELS.hasValue(0)).toBe(false);
      expect(ERROR_LEVELS.hasValue(1)).toBe(true);
    });

    test('keys', () => {
      expect(ERROR_LEVELS.keys()).toEqual(['warn', 'error']);
    });

    test('hasKey', () => {
      expect(ERROR_LEVELS.hasKey('off')).toBe(false);
      expect(ERROR_LEVELS.hasKey('error')).toBe(true);
    });

    test('entries', () => {
      expect(ERROR_LEVELS.entries()).toEqual([
        ['warn', 1],
        ['error', 2],
      ]);
    });

    test('keyOf', () => {
      expect(ERROR_LEVELS.keyOf(1)).toBe('warn');
    });
  });

  describe('labeled enum - remove by value', () => {
    const LEVELS = Enum({ off: 0, warn: 1, error: 2 });
    const ERROR_LEVELS = Enum.exclude(LEVELS, [0]);

    test('accessor', () => {
      expect(ERROR_LEVELS.accessor).toEqual<(typeof ERROR_LEVELS)['accessor']>({
        warn: 1,
        error: 2,
      });
    });

    test('values', () => {
      expect(ERROR_LEVELS.values()).toEqual([1, 2]);
    });

    test('hasValue', () => {
      expect(ERROR_LEVELS.hasValue(0)).toBe(false);
      expect(ERROR_LEVELS.hasValue(1)).toBe(true);
    });

    test('keys', () => {
      expect(ERROR_LEVELS.keys()).toEqual(['warn', 'error']);
    });

    test('hasKey', () => {
      expect(ERROR_LEVELS.hasKey('off')).toBe(false);
      expect(ERROR_LEVELS.hasKey('error')).toBe(true);
    });

    test('entries', () => {
      expect(ERROR_LEVELS.entries()).toEqual([
        ['warn', 1],
        ['error', 2],
      ]);
    });

    test('keyOf', () => {
      expect(ERROR_LEVELS.keyOf(1)).toBe('warn');
    });
  });
});
