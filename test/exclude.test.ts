import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { Enum, InferValue } from '../src';

describe('Enum.exclude', () => {
  test('TSD static type checks', async () => {
    await expectTypeTestsToPassAsync(__filename);
  });

  describe('simple enum', () => {
    const STATUS = Enum(['pending', 'fulfilled', 'rejected']);
    const SETTLED_STATUS = Enum.exclude(STATUS, ['pending']);
    type SettledStatus = InferValue<typeof SETTLED_STATUS>;

    test('accessor', () => {
      expect(SETTLED_STATUS.accessor).toEqual<
        (typeof SETTLED_STATUS)['accessor']
      >({
        fulfilled: 'fulfilled',
        rejected: 'rejected',
      });
    });

    test('values', () => {
      expect(SETTLED_STATUS.values()).toEqual<SettledStatus[]>([
        'fulfilled',
        'rejected',
      ]);
    });

    test('hasValue', () => {
      expect(SETTLED_STATUS.hasValue('pending')).toBe(false);
      expect(SETTLED_STATUS.hasValue('rejected')).toBe(true);
    });

    test('assertValue', () => {
      expect(() => SETTLED_STATUS.assertValue('pending')).toThrowError(
        'Enum value out of range (received "pending", expected one of: "fulfilled", "rejected")'
      );
      expect(() => SETTLED_STATUS.assertValue('rejected')).not.toThrowError();
    });
  });

  describe('labeled enum - remove by key', () => {
    const LEVEL = Enum({ off: 0, warn: 1, error: 2 });
    const ERROR_LEVEL = Enum.exclude(LEVEL, ['off']);

    test('accessor', () => {
      expect(ERROR_LEVEL.accessor).toEqual<(typeof ERROR_LEVEL)['accessor']>({
        warn: 1,
        error: 2,
      });
    });

    test('values', () => {
      expect(ERROR_LEVEL.values()).toEqual([1, 2]);
    });

    test('hasValue', () => {
      expect(ERROR_LEVEL.hasValue(0)).toBe(false);
      expect(ERROR_LEVEL.hasValue(1)).toBe(true);
    });

    test('keys', () => {
      expect(ERROR_LEVEL.keys()).toEqual(['warn', 'error']);
    });

    test('hasKey', () => {
      expect(ERROR_LEVEL.hasKey('off')).toBe(false);
      expect(ERROR_LEVEL.hasKey('error')).toBe(true);
    });

    test('entries', () => {
      expect(ERROR_LEVEL.entries()).toEqual([
        ['warn', 1],
        ['error', 2],
      ]);
    });

    test('keyOf', () => {
      expect(ERROR_LEVEL.keyOf(1)).toBe('warn');
    });
  });

  describe('labeled enum - remove by value', () => {
    const LEVEL = Enum({ off: 0, warn: 1, error: 2 });
    const ERROR_LEVEL = Enum.exclude(LEVEL, [0]);

    test('accessor', () => {
      expect(ERROR_LEVEL.accessor).toEqual<(typeof ERROR_LEVEL)['accessor']>({
        warn: 1,
        error: 2,
      });
    });

    test('values', () => {
      expect(ERROR_LEVEL.values()).toEqual([1, 2]);
    });

    test('hasValue', () => {
      expect(ERROR_LEVEL.hasValue(0)).toBe(false);
      expect(ERROR_LEVEL.hasValue(1)).toBe(true);
    });

    test('keys', () => {
      expect(ERROR_LEVEL.keys()).toEqual(['warn', 'error']);
    });

    test('hasKey', () => {
      expect(ERROR_LEVEL.hasKey('off')).toBe(false);
      expect(ERROR_LEVEL.hasKey('error')).toBe(true);
    });

    test('entries', () => {
      expect(ERROR_LEVEL.entries()).toEqual([
        ['warn', 1],
        ['error', 2],
      ]);
    });

    test('keyOf', () => {
      expect(ERROR_LEVEL.keyOf(1)).toBe('warn');
    });
  });
});
